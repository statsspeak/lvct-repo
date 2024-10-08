"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ConsentDocumentPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-purple-700 to-red-500 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-lvct-purple">
            Patient Consent Form for HPV Testing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            By agreeing to this consent form, you are giving permission for HPV
            testing and related procedures. Please read the following
            information carefully:
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong>Purpose of the Test:</strong> The HPV test is designed to
              detect the presence of human papillomavirus (HPV), which can cause
              cervical cancer and other health issues.
            </li>
            <li>
              <strong>Test Procedure:</strong> The test involves collecting a
              small sample of cells from your cervix. This procedure is
              generally quick and may cause slight discomfort.
            </li>
            <li>
              <strong>Risks and Benefits:</strong> The test has minimal risks
              and can help in early detection of potential health issues. Early
              detection can lead to more effective treatment.
            </li>
            <li>
              <strong>Confidentiality:</strong> Your test results and personal
              information will be kept confidential and only shared with
              healthcare professionals directly involved in your care.
            </li>
            <li>
              <strong>Use of Data:</strong> Anonymized data may be used for
              research purposes to improve healthcare services. Your personal
              identifying information will not be used in any research.
            </li>
            <li>
              <strong>Right to Withdraw:</strong> You have the right to withdraw
              your consent at any time before the test is performed, without any
              penalty or loss of benefits to which you are otherwise entitled.
            </li>
            <li>
              <strong>Results Communication:</strong> Your test results will be
              communicated to you by a healthcare professional who can explain
              the results and advise on any necessary follow-up.
            </li>
          </ol>
          <p>
            By providing your name and the date in the self-registration form,
            you acknowledge that you have read, understood, and agree to the
            terms outlined in this consent form.
          </p>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => window.print()}
              className="bg-lvct-purple hover:bg-lvct-purple/90"
            >
              Print Consent Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
