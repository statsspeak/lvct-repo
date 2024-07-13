// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { registerUser } from '@/app/actions/auth'

// export default function Register() {
//     const [error, setError] = useState<string | null>(null)
//     const router = useRouter()

//     async function onSubmit(formData: FormData) {
//         const result = await registerUser(formData)
//         if (result.error) {
//             setError(typeof result.error === 'string' ? result.error : 'Registration failed')
//         } else {
//             router.push('/login')
//         }
//     }

//     return (
//         <div className="flex min-h-screen items-center justify-center">
//             <form action={onSubmit} className="space-y-4 w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
//                 <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
//                 {error && <p className="text-red-500 text-center">{error}</p>}
//                 <div>
//                     <Label htmlFor="name">Name</Label>
//                     <Input id="name" name="name" required />
//                 </div>
//                 <div>
//                     <Label htmlFor="email">Email</Label>
//                     <Input id="email" name="email" type="email" required />
//                 </div>
//                 <div>
//                     <Label htmlFor="password">Password</Label>
//                     <Input id="password" name="password" type="password" required />
//                 </div>
//                 <div>
//                     <Label htmlFor="role">Role</Label>
//                     <select
//                         id="role"
//                         name="role"
//                         className="w-full p-2 border rounded"
//                         required
//                     >
//                         <option value="STAFF">Staff</option>
//                         <option value="LAB_TECHNICIAN">Lab Technician</option>
//                         <option value="CALL_CENTER_AGENT">Call Center Agent</option>
//                     </select>
//                 </div>
//                 <Button type="submit" className="w-full">Register</Button>
//             </form>
//         </div>
//     )
// }