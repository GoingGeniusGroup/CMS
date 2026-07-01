# Server Actions Documentation

## ✅ Migration Complete: API Routes → Server Actions

All authentication APIs have been converted to Next.js Server Actions for better performance and type safety.

---

## 📁 File Structure

```
app/
├── actions/
│   └── auth.ts          ← Server Actions (NEW)
├── api/
│   ├── auth/
│   │   └── [...nextauth]/
│   │       └── route.ts  ← NextAuth API (kept)
│   └── register/
│       └── route.ts      ← DELETED (replaced by server action)
└── (auth)/
    ├── register/
    │   └── page.tsx      ← Updated to use server action
    └── login/
        └── LoginForm.tsx ← Uses NextAuth client
```

---

## 🚀 Available Server Actions

### 1. `registerUser()`

**Purpose:** Register a new user account

**Location:** `app/actions/auth.ts`

**Input:**
```typescript
{
  name?: string;
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
  error?: string;
}
```

**Usage Example:**
```typescript
import { registerUser } from "@/app/actions/auth";

const result = await registerUser({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123"
});

if (result.success) {
  console.log("User created:", result.user);
} else {
  console.error("Error:", result.error);
}
```

**Validation:**
- Email must be valid format
- Password minimum 8 characters
- Password must have uppercase letter
- Password must have number
- Email must be unique (checks database)

**Error Handling:**
- Duplicate email: "Email already registered"
- Invalid data: "Invalid input data"
- Database error: "Registration failed. Please try again."

---

### 2. `loginUser()`

**Purpose:** Authenticate user with credentials

**Location:** `app/actions/auth.ts`

**Input:**
```typescript
{
  email: string;
  password: string;
}
```

**Output:**
```typescript
{
  success: boolean;
  error?: string;
}
```

**Usage Example:**
```typescript
import { loginUser } from "@/app/actions/auth";

const result = await loginUser({
  email: "admin@goinggenius.com",
  password: "Admin@123"
});

if (result.success) {
  // Redirect to dashboard
  router.push("/dashboard");
} else {
  // Show error
  setError(result.error);
}
```

**Error Handling:**
- Invalid credentials: "Invalid email or password"
- Auth error: "Authentication failed"
- Unknown error: "An error occurred during login"

---

### 3. `getCurrentUser()`

**Purpose:** Get currently logged-in user

**Location:** `app/actions/auth.ts`

**Input:** None

**Output:**
```typescript
{
  id: string;
  name: string | null;
  email: string | null;
  role: string;
} | null
```

**Usage Example:**
```typescript
import { getCurrentUser } from "@/app/actions/auth";

const user = await getCurrentUser();

if (user) {
  console.log("Logged in as:", user.email);
  console.log("Role:", user.role);
} else {
  console.log("Not logged in");
}
```

---

## 🔄 Why Server Actions?

### Benefits over API Routes:

1. **Type Safety** ✅
   - Full TypeScript support
   - Shared types between client and server
   - Compile-time error checking

2. **Better Performance** ⚡
   - No separate API call overhead
   - Automatic code splitting
   - Smaller bundle sizes

3. **Simpler Code** 🎯
   - Direct function calls
   - No manual fetch() calls
   - No JSON parsing needed

4. **Progressive Enhancement** 🌐
   - Works without JavaScript
   - Form submissions still work
   - Better accessibility

5. **Security** 🔒
   - Automatic CSRF protection
   - Server-only code guaranteed
   - No client exposure

---

## 📊 Comparison: Before vs After

### Before (API Route):
```typescript
// Client component
const response = await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const result = await response.json();

if (!response.ok) {
  setError(result.error);
  return;
}
```

### After (Server Action):
```typescript
// Client component
const result = await registerUser(data);

if (!result.success) {
  setError(result.error);
  return;
}
```

**Lines of code:** 9 → 5 (44% reduction!)

---

## 🛡️ Security Features

### Input Validation
```typescript
const validated = registerSchema.parse(formData);
```
- Uses Zod for schema validation
- Type-safe validation
- Detailed error messages

### Password Hashing
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
```
- 10 rounds of bcrypt
- Industry-standard security
- Salted hashes

### Error Handling
```typescript
try {
  // Action logic
} catch (error) {
  console.error("Error:", error);
  return { success: false, error: "Safe error message" };
}
```
- Never expose internal errors
- User-friendly messages
- Server-side logging

---

## 💡 Usage Patterns

### Pattern 1: Form Submission
```typescript
"use client";

import { useForm } from "react-hook-form";
import { registerUser } from "@/app/actions/auth";

export function RegisterForm() {
  const { register, handleSubmit } = useForm();

  async function onSubmit(data) {
    const result = await registerUser(data);
    
    if (result.success) {
      // Success logic
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

### Pattern 2: Server Component
```typescript
import { getCurrentUser } from "@/app/actions/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }

  return <div>Welcome, {user.name}!</div>;
}
```

### Pattern 3: API Route (if needed)
```typescript
import { registerUser } from "@/app/actions/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await registerUser(body);
  
  return Response.json(result);
}
```

---

## 🔧 Adding New Server Actions

### Step 1: Define in `app/actions/auth.ts`
```typescript
"use server";

export async function myNewAction(data: MyInput) {
  try {
    // Validate
    const validated = mySchema.parse(data);
    
    // Business logic
    const result = await someOperation(validated);
    
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Error message" };
  }
}
```

### Step 2: Use in Client Component
```typescript
"use client";

import { myNewAction } from "@/app/actions/auth";

const result = await myNewAction(data);
```

### Step 3: Use in Server Component
```typescript
import { myNewAction } from "@/app/actions/auth";

const result = await myNewAction(data);
```

---

## 🧪 Testing Server Actions

### Manual Testing:
1. Start dev server: `npm run dev`
2. Open browser DevTools (F12)
3. Go to Network tab
4. Perform action (register, login, etc.)
5. Check network requests
6. Check console for errors

### What to Look For:
- ✅ No errors in console
- ✅ Proper success/error messages
- ✅ Data validation working
- ✅ Database updates correctly
- ✅ Redirects working

---

## 📝 Common Issues & Solutions

### Issue: "Server Action not found"
**Solution:** Make sure file starts with `"use server"`

### Issue: "Cannot call server action"
**Solution:** Import from correct path: `@/app/actions/auth`

### Issue: "Prisma client not initialized"
**Solution:** Run `npx prisma generate`

### Issue: "Validation error"
**Solution:** Check input matches Zod schema in `lib/validations/auth.ts`

---

## 🎯 Best Practices

1. **Always Validate Input** ✅
   ```typescript
   const validated = schema.parse(input);
   ```

2. **Return Consistent Structure** ✅
   ```typescript
   { success: boolean, data?: T, error?: string }
   ```

3. **Handle Errors Gracefully** ✅
   ```typescript
   try/catch with user-friendly messages
   ```

4. **Log Server-Side** ✅
   ```typescript
   console.error("Server error:", error);
   ```

5. **Never Expose Secrets** ✅
   ```typescript
   Return sanitized error messages only
   ```

---

## 🚀 Performance Tips

1. **Use Server Components When Possible**
   - Faster initial load
   - No client JavaScript needed

2. **Minimize Client Bundle**
   - Keep logic in server actions
   - Import only what's needed

3. **Cache Results**
   ```typescript
   import { cache } from "react";
   export const getCachedUser = cache(getCurrentUser);
   ```

4. **Parallel Actions**
   ```typescript
   const [user, posts] = await Promise.all([
     getCurrentUser(),
     getPosts()
   ]);
   ```

---

## 📚 Resources

- [Next.js Server Actions Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [NextAuth.js with Server Actions](https://next-auth.js.org/getting-started/example)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)

---

## ✅ Migration Checklist

- [x] Created `app/actions/auth.ts`
- [x] Added `registerUser` action
- [x] Added `loginUser` action
- [x] Added `getCurrentUser` action
- [x] Updated register page to use server action
- [x] Deleted old `/api/register` route
- [x] Tested registration flow
- [x] Tested error handling
- [x] Updated documentation

---

**Migration Complete!** 🎉

Your auth system now uses modern Next.js Server Actions for better performance, type safety, and developer experience.
