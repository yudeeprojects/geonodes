# Документація Проекту: my-geo-nodes

**Опис проекту**: Це веб-додаток у стилі редактора "Geometry Nodes" (подібного до Blender), побудований з використанням React, Next.js, React Three Fiber (R3F) та Zustand.
Мета додатку — надати користувачам можливість створювати, змінювати та маніпулювати 3D-геометрію у браузері, застосовуючи різні трансформації та модифікатори.

## 1. Архітектура та Технологічний Стек

- **Фреймворк**: Next.js (App Router)
- **3D Графіка**: Three.js через React Three Fiber (`@react-three/fiber`), що дозволяє використовувати декларативний підхід до 3D-сцени у React.
- **Управління станом**: Zustand (`lib/store.ts`). Забезпечує зберігання всіх глобальних станів, таких як список об'єктів (вузлів), поточний вибраний об'єкт, тощо.
- **UI та Стилізація**: TailwindCSS.
- **Допоміжні утиліти R3F**: `@react-three/drei` — використовується для камери, контролерів (`OrbitControls`), трансформаційних контролерів (`PivotControls`), сітки (`Grid`), та оточення (`Environment`).

## 2. Ключові Структури Даних

Вся 3D-сцена описується масивом об'єктів `UniversalGeometry`. Це єдине та універсальне джерело правди інфраструктури:

```typescript
// types/geometry.ts
export interface UniversalGeometry {
  id: string;
  type: "MESH" | "INSTANCES" | "POINTS" | "CURVE";

  // Базові трансформації (позиція, обертання, масштаб)
  transform: {
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
  };

  // Атрибути геометрії (вершини, індекси, нормалі, UV)
  // Використання типізованих масивів (Float32Array) забезпечує високу продуктивність WebGL
  attributes: {
    position: Float32Array;
    index?: Uint16Array;
    normal?: Float32Array;
    uv?: Float32Array;
    [key: string]: Float32Array | Uint16Array | undefined;
  };

  // Налаштування рендерингу (колір, видимість, прозорість)
  settings: {
    color: string;
    wireframe: boolean;
    visible: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    opacity: number;
    transparent: boolean;
  };
}
```

## 3. Управління Станом (Zustand) та Оптимізація

Проект використовує `useGeoStore` для всього стану. Особливість цієї архітектури в тому, що для уникнення затримок (ре-рендерів React) під час активних маніпуляцій з 3D геометрією, система використовує нереактивні мапи та реєстри.

```typescript
// lib/store.ts
export const meshRegistry = new Map<string, THREE.Mesh>();
export const navState = { isNavigating: false };

export const useGeoStore = create<GeoState>((set) => ({
  nodes: initialNodes,
  selectedId: null,
  isGrabActive: false,
  // ...
  setMeshRef: (id, ref) => {
    if (ref) meshRegistry.set(id, ref);
    else meshRegistry.delete(id);
  },
  updateTransform: (id, transform) => set((state) => ({ /* ... */ })),
}));
```

Це дозволяє компонентам отримувати доступ безпосередньо до нативного об'єкту `THREE.Mesh` через `meshRegistry` без необхідності проганяти кожну 0.01 кадру оновлення через редуктори React.

## 4. Головна Сцена та її Рендеринг

Точка входу до 3D-рендеру — `components/Scene.tsx`. Вона ініціалізує `<Canvas>` від React Three Fiber.
Головні особливості цього компоненту:
- Відмальовує кожен елемент дерева об'єктів як `<GeoMesh>`.
- Надає менеджер камер (`CameraFocusManager`), який дозволяє плавно концентрувати орбітальну камеру на вибраному об'єкті:
  ```tsx
  // Фокус камери
  useFrame(() => {
    // ...
    mesh.getWorldPosition(targetPos);
    (controls as any).target.lerp(targetPos, 0.1);
  });
  ```
- Кастомізує управління камерою та освітлення, даючи сцені преміальний "фізичний" (PBR) вигляд за допомогою `ContactShadows` та `Environment`.

## 5. Компонент Мешу: Побудова Геометрії з масивів

`GeoMesh.tsx` перетворює `UniversalGeometry` на екранні пікселі. В ньому використовуються `<bufferGeometry>`, що дозволяє малювати 3D прямо з "голих" масивів вершин (Positions, Indices, Normals).

```tsx
// components/GeoMesh.tsx
<mesh
  ref={meshRef}
  position={isSelected && isGrabActive ? undefined : [0, 0, 0]}
  scale={isSelected && isGrabActive ? undefined : data.transform.scale}
>
  <bufferGeometry>
    <bufferAttribute
      attach="attributes-position" 
      count={data.attributes.position.length / 3}
      array={data.attributes.position} itemSize={3}
    />
    {data.attributes.index && (
      <bufferAttribute
        attach="index" 
        count={data.attributes.index.length}
        array={data.attributes.index} itemSize={1}
      />
    )}
  </bufferGeometry>
  <meshStandardMaterial color={isSelected ? "#facc15" : data.settings.color} />
</mesh>
```
Об'єкт огорнуто в `<PivotControls>`, що надає візуальні стрілки взаємодії для управління мишкою. Знову ж, після закінчення переміщення (`onDragEnd`), нові координати зберігаються назад в Zustand-стор.

## 6. Взаємодія з клавіатурою (Blender Controls)

Для досягнення "Blender-like" враження, ми побудували систему через хуки в `useBlenderControls.ts` та компонент `BlenderControls.tsx`.  
Натискання клавіші `G` ініціює режим "Grab" (захоплення/переміщення), а `S` — режим "Scale" (масштабування).
Ключовий фактор:
- Щоб не підпадати під ліміти швидкодії React, маніпулювання під час руху "G" ігнорує стан. Вона рухає безпосередньо екземпляр з `meshRegistry.get()`.
- Натискання `X`, `Y` або `Z` під час "Grab" може заблокувати переміщення по відповідній вісі, подібно класичному Blender HUD.
- Натискання `Shift + Z` блокує лише вісь Z, залишаючи вільний рух в площині X-Y.

## 7. Генерація Примітивів

Об'єкти не беруться з повітря — вони генеруються алгоритмічно (наприклад, файли як `lib/nodes/primitives.ts`), що є першим кроком у створенні "Ноди Геометрії".  
Кожен такий генератор вираховує свій розмір, обчислює кількість трикутників і повертає `UniversalGeometry` з заповненими масивами `attributes`.

---
**Підсумок**: Цей проект закладає ідеальну й потужну базу до реалізації 3D редактору, який легко зможе розширюватися до нових типів (Точки, Криві), нових модифікаторів (Wave, Twist, Subdivide), та вузлового (node-based) інтерфейсу редагування логіки на льоту!
