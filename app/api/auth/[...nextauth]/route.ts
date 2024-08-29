import { handlers } from "@/auth"; // Referring to the auth.ts we just created
import { startAutomatedCommunications } from "@/lib/automatedCommunications";


// startAutomatedCommunications();

export const { GET, POST } = handlers;
