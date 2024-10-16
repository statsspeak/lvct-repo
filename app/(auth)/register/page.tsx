import { Card } from "@/components/ui/card";
import { ContactAdminCard } from "@/components/contact-admin-card";

export default function RegisterPage() {
  const adminEmail = "admin@example.com"; // Replace with the actual admin email

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 to-red-500 p-4">
      <Card className="w-full max-w-md">
        <ContactAdminCard adminEmail={adminEmail} />
      </Card>
    </div>
  );
}

// import { RegisterForm } from "@/components/RegisterForm";

// export default function RegisterPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-700 to-red-500 p-4">
//       <RegisterForm />
//     </div>
//   );
// }
