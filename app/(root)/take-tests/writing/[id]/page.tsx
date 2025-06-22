import { RedirectToSignIn } from "@clerk/nextjs";
import { getWritingSetForUser } from "@/lib/actions/test.action";
import WritingComponent from "@/components/WritingComponent";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AccessControlClient from "@/components/AccessControlClient";

const WritingTestSession = async ({
	params,
	searchParams,
}: TestSessionProps) => {
	const { userId } = await auth();
	const { id } = await params;
	const { mode } = await searchParams;

	if (!userId) return <RedirectToSignIn />;

	const writingSet = await getWritingSetForUser(id);
	if (!writingSet) {
		redirect("/take-tests/writing");
	}

	return (
		<>
			<AccessControlClient route="writing" />
			<div className="w-full h-[90vh]">
				<WritingComponent
					{...writingSet}
					setId={id}
					mode={mode as WritingTestMode}
				/>
			</div>
		</>
	);
};

export default WritingTestSession;
