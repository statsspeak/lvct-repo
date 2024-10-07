import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export async function generateSelfRegistrationQRCode() {
  const uniqueId = uuidv4();
  const selfRegistrationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/patient-self-registration/${uniqueId}`;

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(selfRegistrationUrl);
    return { qrCodeDataUrl, uniqueId };
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return { error: "Failed to generate QR code" };
  }
}
