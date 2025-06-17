const WordCount = ({ text }: { text: string }) => {
	const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
	return (
		<p className="text-right text-xs text-muted-foreground mt-1">
			Word Count: {wordCount}
		</p>
	);
};

export default WordCount;
