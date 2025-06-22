import AccessControlClient from "@/components/AccessControlClient";
import SpeakingComponent from "@/components/SpeakingComponent";
import { getSpeakingSetForUser } from "@/lib/actions/test.action";
import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// !! Getting error from access control because redirect is not allowed in server components due to SSR
const SpeakingTestSession = async ({
	params,
	searchParams,
}: TestSessionProps) => {
	const { userId } = await auth();
	const { id } = await params;
	const { mode } = await searchParams;

	if (!userId) return <RedirectToSignIn />;

	const speakingSet = await getSpeakingSetForUser(id);
	if (!speakingSet.part2 || speakingSet.part3.length === 0) {
		redirect("/take-tests/speaking");
	}

	return (
		<>
			<AccessControlClient route="speaking" />
			<SpeakingComponent
				{...speakingSet}
				setId={id}
				mode={mode as SpeakingTestMode}
			/>
		</>
	);
};

export default SpeakingTestSession;
