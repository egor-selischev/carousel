# Теоретическая часть

Все примеры кода проверены компилятором TypeScript 5.9 в режиме `strict`. Строки с `// @ts-expect-error` показывают ошибки, которые компилятор обязан найти: если ошибки там нет, сборка упадёт.

---

## Вопрос 1. Дженерики (Generics)

### Определение

Дженерик — это тип-параметр, который подставляется при каждом использовании функции, класса, интерфейса или типа. Один и тот же код работает с разными типами и при этом не теряет информацию о них: компилятор знает, какой тип пришёл на вход, и может вывести, какой тип вернётся.

Зачем они нужны:

- **повторное использование:** одна реализация вместо `getString`, `getNumber`, `getUser`;
- **типобезопасность:** связь между входом и выходом проверяет компилятор;
- **вывод типов:** в большинстве вызовов тип указывать не нужно, TypeScript выведет его из аргументов.

### Отличие от `any`

`any` отключает проверку типов: к значению можно обратиться как угодно, и компилятор промолчит. Кроме того, `any` «заражает» всё, что из него получено. Дженерик же сохраняет конкретный тип и проверяет каждое использование.

```typescript
function identityAny(arg: any): any {
  return arg;
}

function identity<T>(arg: T): T {
  return arg;
}

const fromAny = identityAny('text'); // fromAny: any — информация о типе потеряна
fromAny.toFixed(2); // компилируется, но в рантайме: TypeError: toFixed is not a function

const fromGeneric = identity('text'); // fromGeneric: 'text' — тип сохранён вплоть до литерала
// @ts-expect-error — Property 'toFixed' does not exist on type '"text"'
fromGeneric.toFixed(2);

export {};
```

Разница проявляется ещё при написании кода: с `any` ошибка найдётся только в рантайме, с дженериком её подсветит редактор.

### Дженерик без ограничений

`T` может быть любым типом. Внутри функции с `T` можно делать только то, что допустимо для любого значения: сохранить, вернуть, передать дальше.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42); // T выведен из аргумента → литерал 42 (подтип number)
const explicit = identity<string>('hi'); // T указан явно

// Дженерик в интерфейсе: форма ответа одна, данные разные
interface ApiResponse<TData> {
  data: TData;
  receivedAt: number;
}

function wrap<TData>(data: TData): ApiResponse<TData> {
  return { data, receivedAt: Date.now() };
}

const response = wrap([{ id: '1', title: 'Slide' }]);
const firstTitle: string | undefined = response.data[0]?.title; // тип элементов известен

// Пример из проекта (shared/lib/storage.ts)
function saveToStorage<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

saveToStorage('numbers', [1, 2, 3]);

export { num, explicit, firstTitle };
```

### Дженерик с ограничением (`extends`)

Ограничение `T extends X` говорит: «`T` — любой тип, совместимый с `X`». Это даёт три вещи:

1. **сужает допустимые типы:** неподходящий аргумент не скомпилируется;
2. **открывает доступ к свойствам внутри функции:** про `T` известно, что у него есть поля `X`;
3. **сохраняет точный тип:** в отличие от параметра типа `X`, возвращается исходный `T`, а не урезанный до `X`.

```typescript
interface HasLength {
  length: number;
}

function longest<T extends HasLength>(a: T, b: T): T {
  return a.length >= b.length ? a : b; // .length доступен благодаря ограничению
}

const longestString = longest('abc', 'de'); // 'abc' | 'de'
const longestArray = longest([1, 2, 3], [4]); // number[] — точный тип сохранён

// @ts-expect-error — Argument of type 'number' is not assignable to parameter of type 'HasLength'
longest(10, 20);

// Ограничение через keyof: ключ обязан существовать в объекте
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Egor', age: 30, isAdmin: false };

const userName = getProperty(user, 'name'); // string
const userAge = getProperty(user, 'age'); // number

// @ts-expect-error — Argument of type '"email"' is not assignable to parameter of type '"name" | "age" | "isAdmin"'
getProperty(user, 'email');

export { longestString, longestArray, userName, userAge };
```

`K extends keyof T` связывает два параметра: ключ зависит от объекта, а тип результата `T[K]` зависит от ключа. Без ограничения запись `obj[key]` не скомпилировалась бы.

---

## Вопрос 2. type vs interface

### Ключевые различия

| Возможность                               | `interface`                | `type`                              |
| ----------------------------------------- | -------------------------- | ----------------------------------- |
| Описание формы объекта                    | да                         | да                                  |
| Declaration merging (слияние объявлений)  | да                         | нет, повторное имя — ошибка         |
| Наследование                              | `extends`                  | через пересечение `&`               |
| `implements` в классе                     | да                         | да, если это объектный тип          |
| Union, tuple, примитивы, функции          | нет                        | да                                  |
| Mapped и conditional types                | нет                        | да                                  |
| Проверка конфликта свойств при расширении | ошибка сразу при `extends` | при `&` конфликт молча даёт `never` |

**Declaration merging.** Несколько объявлений `interface` с одним именем сливаются в одно. Так расширяют чужие типы, например `Window` или темы UI-библиотек.

```typescript
interface Settings {
  theme: 'light' | 'dark';
}

interface Settings {
  language: string;
}

// Оба объявления слились: нужны оба поля
const settings: Settings = { theme: 'dark', language: 'ru' };

// Module augmentation — практическое применение merging
declare global {
  interface Window {
    __APP_VERSION__?: string;
  }
}

const version: string | undefined = window.__APP_VERSION__;

// С type так нельзя:
// type Config = { theme: string };
// type Config = { language: string }; // Error: Duplicate identifier 'Config'

export { settings, version };
```

**Универсальность `type`.** Алиас типа может называть что угодно, не только объект:

```typescript
type Id = string; // алиас примитива
type Status = 'idle' | 'loading' | 'error'; // union
type Point = [x: number, y: number]; // tuple
type Comparator<T> = (a: T, b: T) => number; // функция
type Nullable<T> = { [K in keyof T]: T[K] | null }; // mapped type
type ElementOf<T> = T extends readonly (infer Item)[] ? Item : never; // conditional type

const status: Status = 'idle';
const point: Point = [10, 20];
const byNumber: Comparator<number> = (a, b) => a - b;
const nullableUser: Nullable<{ name: string; id: Id }> = { name: null, id: '1' };
const item: ElementOf<string[]> = 'slide';

export { status, point, byNumber, nullableUser, item };
```

### Критерии выбора

**`interface`** подходит, когда:

- описывается форма объекта или контракт класса (`implements`);
- тип входит в публичный API библиотеки и потребители должны уметь его дополнять через merging (как `Window` или `MantineThemeOverride`);
- строится иерархия через `extends`: компилятор сразу проверит совместимость, а сообщения об ошибках будут короче.

**`type`** подходит, когда:

- нужен union, intersection, tuple, алиас примитива или функции;
- нужны mapped и conditional типы, утилиты и вычисляемые типы;
- merging не нужен или даже вреден: тип должен быть закрытым и объявленным в одном месте.

Часто принимают простое правило: объекты и контракты описывают через `interface`, всё остальное через `type`. Главное — применять выбранное правило единообразно по всему проекту.

### Расширение: `extends` и `&`

```typescript
interface Entity {
  id: string;
}

// interface → extends
interface Slide extends Entity {
  title: string;
}

// type → intersection
type EntityT = { id: string };
type SlideT = EntityT & { title: string };

const a: Slide = { id: '1', title: 'Interface' };
const b: SlideT = { id: '2', title: 'Type' };

// Интерфейс может расширять type, а type — пересекаться с интерфейсом
interface CheckedSlide extends SlideT {
  isChecked: boolean;
}
type CheckedSlideT = Slide & { isChecked: boolean };

// Разница при конфликте свойств:
interface WithStringValue {
  value: string;
}

// @ts-expect-error — Interface 'WithNumberValue' incorrectly extends interface 'WithStringValue'
interface WithNumberValue extends WithStringValue {
  value: number;
}

// Пересечение не выдаёт ошибку: value получает тип string & number = never,
// и проблема всплывёт только при попытке создать объект
type Conflicting = WithStringValue & { value: number };
type ConflictValue = Conflicting['value']; // never

export type { CheckedSlide, CheckedSlideT, WithNumberValue, ConflictValue };
export { a, b };
```

---

## Вопрос 3. Intersection и Union

### Разница по смыслу

Тип удобно представлять как **множество допустимых значений**.

- **Union `A | B`** — логическое ИЛИ. Значение принадлежит `A` или `B`. Множество значений **расширяется**: подходит всё, что подходит хотя бы под один вариант.
- **Intersection `A & B`** — логическое И. Значение одновременно удовлетворяет `A` и `B`. Множество значений **сужается** до общих, зато требований к объекту становится больше: он должен иметь свойства обоих типов.

### Как это влияет на доступные свойства

- **Intersection:** объект обязан иметь **все свойства всех типов**, и все они доступны без проверок.
- **Union:** без проверки доступны **только общие свойства**, которые есть в каждом варианте. Компилятор не знает, какой вариант пришёл, поэтому специфичные поля становятся доступны только после сужения типа (narrowing).

```typescript
interface Cat {
  name: string;
  meow: () => string;
}

interface Dog {
  name: string;
  bark: () => string;
}

type CatOrDog = Cat | Dog;
type CatAndDog = Cat & Dog;

function greet(pet: CatOrDog): string {
  const petName = pet.name; // общее поле — доступно

  // @ts-expect-error — Property 'meow' does not exist on type 'Dog'
  pet.meow();

  return petName;
}

// Intersection: нужны все свойства обоих типов
const catDog: CatAndDog = {
  name: 'CatDog',
  meow: () => 'meow',
  bark: () => 'woof',
};

catDog.meow(); // оба метода доступны без проверок
catDog.bark();

// Для примитивов пересечение несовместимых типов пусто
type Impossible = string & number; // never

export type { Impossible };
export { greet };
```

### Type guard

Type guard — выражение, после которого компилятор сужает union до конкретного варианта внутри блока. Встроенные способы:

- `typeof value === 'string'` — для примитивов;
- `value instanceof Date` — для экземпляров классов;
- `'key' in value` — по наличию свойства;
- проверка поля-дискриминатора (`kind`, `type`, `status`) в discriminated union;
- **пользовательский предикат** `function isX(value: A | B): value is A`, когда проверка сложная или нужна в нескольких местах.

```typescript
// Встроенные guards
function format(value: string | number | Date): string {
  if (typeof value === 'string') return value.toUpperCase(); // string
  if (value instanceof Date) return value.toISOString(); // Date
  return value.toFixed(2); // number — остался последний вариант
}

// Discriminated union: общее поле kind с литеральным типом
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  side: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // здесь shape: Circle
    case 'square':
      return shape.side ** 2; // shape: Square
    case 'rectangle':
      return shape.width * shape.height; // shape: Rectangle
    default: {
      // Exhaustive check: если добавить новый Shape и забыть case — ошибка компиляции
      const unreachable: never = shape;
      return unreachable;
    }
  }
}

// Пользовательский type predicate
function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle';
}

const shapes: Shape[] = [
  { kind: 'circle', radius: 1 },
  { kind: 'square', side: 2 },
];

const circles: Circle[] = shapes.filter(isCircle); // предикат сужает тип и в filter

// Guard через in
function describe(pet: { meow: () => void } | { bark: () => void }): string {
  return 'meow' in pet ? 'кошка' : 'собака';
}

export { format, area, circles, describe };
```

Предикат `value is Circle` — это обещание компилятору. TypeScript не проверяет, что тело функции действительно проверяет тип, поэтому ошибка в реализации предиката приведёт к неверному сужению.

---

## Вопрос 4. Разбор типа `KeysOfType<T, U>`

```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
```

Тип возвращает union тех ключей `T`, значения которых совместимы с `U`.

### Построчный разбор

1. **`keyof T`** — union имён всех ключей `T`. Для `{ id: number; name: string }` это `'id' | 'name'`.

2. **`[K in keyof T]: ...`** — mapped type. Он перебирает каждый ключ `K` из этого union и создаёт новый объектный тип с теми же ключами, но с вычисленными значениями.

3. **`T[K] extends U ? K : never`** — условный тип для каждого ключа:
   - `T[K]` — тип значения по ключу `K` (indexed access type);
   - если `T[K]` совместим с `U`, значением становится **сам ключ** `K` как строковый литерал;
   - иначе значение `never`.

   Промежуточный результат — объект вида `{ id: never; name: 'name' }`.

4. **`[keyof T]`** — индексация объекта union-ом всех его ключей. Она возвращает union **всех значений**: `never | 'name'`. Тип `never` означает пустое множество, поэтому в union он поглощается: `X | never = X`. Остаются только нужные ключи.

### Пример по шагам

```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  age: number;
}

// Шаг 1: keyof
type Step1 = keyof User; // 'id' | 'name' | 'email' | 'isAdmin' | 'age'

// Шаг 2: mapped + conditional
type Step2 = { [K in keyof User]: User[K] extends string ? K : never };
// {
//   id: never;
//   name: 'name';
//   email: 'email';
//   isAdmin: never;
//   age: never;
// }

// Шаг 3: индексация по всем ключам → union значений, never исчезает
type Step3 = Step2[keyof User]; // never | 'name' | 'email' | never | never → 'name' | 'email'

type StringKeys = KeysOfType<User, string>; // 'name' | 'email'
type NumberKeys = KeysOfType<User, number>; // 'id' | 'age'
type BooleanKeys = KeysOfType<User, boolean>; // 'isAdmin'

// Проверка равенства типов на уровне компилятора
type Equal<X, Y> =
  (<V>() => V extends X ? 1 : 2) extends <V>() => V extends Y ? 1 : 2 ? true : false;

const stringKeysCheck: Equal<StringKeys, 'name' | 'email'> = true;
const numberKeysCheck: Equal<NumberKeys, 'id' | 'age'> = true;
const booleanKeysCheck: Equal<BooleanKeys, 'isAdmin'> = true;

// Практическое применение: ключ сортировки может быть только числовым полем
function sortByNumber<T extends Record<K, number>, K extends KeysOfType<T, number>>(
  items: readonly T[],
  key: K,
): T[] {
  return [...items].sort((a, b) => a[key] - b[key]);
}

const users: User[] = [
  { id: 2, name: 'Anna', email: 'anna@example.com', isAdmin: false, age: 31 },
  { id: 1, name: 'Oleg', email: 'oleg@example.com', isAdmin: true, age: 27 },
];

const byAge = sortByNumber(users, 'age');

// @ts-expect-error — 'name' не является числовым ключом
sortByNumber(users, 'name');

export type { Step1, Step3 };
export { stringKeysCheck, numberKeysCheck, booleanKeysCheck, byAge };
```

### Нюанс: опциональные свойства

Mapped type по `keyof T` сохраняет модификатор `?`. У опционального поля значение получает тип `... | undefined`, и `undefined` попадает в итоговый union. Кроме того, у `nickname?: string` тип `T[K]` равен `string | undefined`, а это уже не подтип `string`. Модификатор `-?` решает обе проблемы:

```typescript
type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

type StrictKeysOfType<T, U> = {
  [K in keyof T]-?: T[K] extends U ? K : never;
}[keyof T];

interface Profile {
  login: string;
  nickname?: string;
}

type Equal<X, Y> =
  (<V>() => V extends X ? 1 : 2) extends <V>() => V extends Y ? 1 : 2 ? true : false;

// Без -?: nickname отброшен, зато в результат попал undefined
const loose: Equal<KeysOfType<Profile, string>, 'login' | undefined> = true;

// С -?: undefined ушёл; nickname всё ещё не проходит, так как string | undefined не extends string
const strict: Equal<StrictKeysOfType<Profile, string>, 'login'> = true;

// Чтобы учесть опциональные строковые поля, проверяем на совместимость с U | undefined
const withOptional: Equal<
  StrictKeysOfType<Profile, string | undefined>,
  'login' | 'nickname'
> = true;

export { loose, strict, withOptional };
```

---

## Вопрос 5. Утилитарные типы

Ниже общая модель для примеров:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}
```

### `Partial<T>`

Делает **все свойства необязательными**. Подходит для патчей и частичных обновлений, фильтров, значений по умолчанию. Работает поверхностно: вложенные объекты не затрагиваются.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

function updateUser(user: User, patch: Partial<Omit<User, 'id'>>): User {
  return { ...user, ...patch };
}

const user: User = { id: '1', name: 'Name', email: 'name@example.com', password: 'secret' };

const renamed = updateUser(user, { name: 'Name S.' }); // остальные поля можно не передавать

// @ts-expect-error — 'id' исключён из патча: Object literal may only specify known properties
updateUser(user, { id: '2' });

export { renamed };
```

### `Pick<T, K>`

Создаёт тип **только из перечисленных ключей**. Подходит для DTO, пропсов компонентов и превью сущностей. Ключи проверяются: опечатка даст ошибку.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type UserPreview = Pick<User, 'id' | 'name'>;

function UserBadgeLabel(props: UserPreview): string {
  return `${props.name} (#${props.id})`;
}

const label = UserBadgeLabel({ id: '1', name: 'Name' });

// @ts-expect-error — Type '"nmae"' does not satisfy the constraint 'keyof User'
type Broken = Pick<User, 'nmae'>;

// В проекте: entities/slide/model/types.ts
// export type NewSlide = Pick<Slide, 'title' | 'annotation'>;

export type { Broken };
export { label };
```

### `Omit<T, K>`

Противоположность `Pick`: берёт **все ключи, кроме перечисленных**. Удобен, когда нужны почти все поля. Важный нюанс: `K extends keyof any`, поэтому **опечатка в ключе не ловится**.

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;

function toPublicUser({ password: _password, ...rest }: User): PublicUser {
  return rest;
}

const publicUser: PublicUser = toPublicUser({
  id: '1',
  name: 'Name',
  email: 'name@example.com',
  password: 'secret',
});

// @ts-expect-error — пароля в PublicUser нет
const leaked: string = publicUser.password;

type Typo = Omit<User, 'pasword'>; // компилируется молча, password остался в типе

export type { Typo };
export { leaked };
```

### `Record<K, V>`

Объектный тип с ключами `K` и значениями `V`. Подходит для словарей, нормализованных данных по id и маппингов. Если `K` — union литералов, компилятор требует **все** ключи, что даёт проверку исчерпывающего маппинга.

```typescript
interface Slide {
  id: string;
  title: string;
  annotation: string;
  isChecked: boolean;
}

// Нормализованное хранение по id
const slidesById: Record<Slide['id'], Slide> = {
  'slide-1': { id: 'slide-1', title: 'FSD', annotation: '', isChecked: true },
};

// С noUncheckedIndexedAccess чтение по произвольному ключу возвращает Slide | undefined
const maybeSlide = slidesById['unknown'];
const title: string = maybeSlide?.title ?? 'не найден';

// Исчерпывающий маппинг union → значение
type Status = 'idle' | 'loading' | 'error';

const statusLabel: Record<Status, string> = {
  idle: 'Ожидание',
  loading: 'Загрузка',
  error: 'Ошибка',
};

// @ts-expect-error — Property 'error' is missing in type
const incomplete: Record<Status, string> = { idle: 'Ожидание', loading: 'Загрузка' };

export { title, statusLabel, incomplete };
```

### `Readonly<T>`

Делает все свойства **доступными только для чтения**: присваивание становится ошибкой компиляции. Подходит для конфигов, констант, состояния, которое меняют только иммутабельно (как в Zustand и Redux). Защита поверхностная и существует только на этапе компиляции; для глубокой неизменяемости используют `as const` или собственный `DeepReadonly`.

```typescript
interface AppConfig {
  apiUrl: string;
  features: string[];
}

const config: Readonly<AppConfig> = {
  apiUrl: 'https://api.example.com',
  features: ['carousel'],
};

// @ts-expect-error — Cannot assign to 'apiUrl' because it is a read-only property
config.apiUrl = 'https://evil.example.com';

config.features.push('auth'); // компилируется: Readonly поверхностный

// Для массивов — readonly T[] / ReadonlyArray<T>
const seedIds: readonly string[] = ['seed-1', 'seed-2'];

// @ts-expect-error — Property 'push' does not exist on type 'readonly string[]'
seedIds.push('seed-3');

// Глубокая неизменяемость литерала
const ROUTES = { HOME: '/', LOGIN: '/login' } as const;

// @ts-expect-error — Cannot assign to 'HOME' because it is a read-only property
ROUTES.HOME = '/home';

export {};
```

---
