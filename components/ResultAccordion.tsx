"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { BookText, Headphones, MessageSquare, PenLine } from "lucide-react";
import ClientProgressBadge from "@/components/ClientProgressBadge";

const componentIcons = {
	Listening: <Headphones className="text-blue-600" />,
	Reading: <BookText className="text-green-600" />,
	Writing: <PenLine className="text-orange-600" />,
	Speaking: <MessageSquare className="text-purple-600" />,
};

type ResultAccordionProps = {
	results: Record<string, TestResult[]>;
};

export default function ResultAccordion({ results }: ResultAccordionProps) {
	// const components = ["Listening", "Reading", "Writing", "Speaking"];
	const components = ["Speaking", "Writing", "Listening", "Reading"];

	return (
		<Accordion type="single" collapsible defaultValue="Speaking">
			{components.map((comp) => (
				<AccordionItem value={comp} key={comp}>
					<AccordionTrigger className="text-lg font-semibold">
						<div className="flex items-center gap-2">
							{
								componentIcons[
									comp as keyof typeof componentIcons
								]
							}
							<span>{comp} Results</span>
							<ClientProgressBadge test={comp.toLowerCase()} />
						</div>
					</AccordionTrigger>

					<AccordionContent className="accordion-content">
						{results[comp]?.length > 0 ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
								{results[comp].map((res) => (
									<Card key={res.id}>
										<CardHeader className="pb-2">
											<CardTitle className="text-base font-medium">
												{format(
													new Date(res.date),
													"MMM d, yyyy"
												)}
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-2 text-sm">
											<p>
												<strong>Topic:</strong>{" "}
												{res.topic}
											</p>
											<p>
												<strong>Band:</strong>{" "}
												{res.total_score.toFixed(1)}
											</p>
											<Link
												href={`/take-tests/${comp.toLowerCase()}/${
													res.set_id
												}/feedback`}
											>
												<Button
													variant="outline"
													className="mt-2 w-full"
												>
													View Feedback
												</Button>
											</Link>
										</CardContent>
									</Card>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground mt-2">
								No {comp.toLowerCase()} results found.
							</p>
						)}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	);
}
