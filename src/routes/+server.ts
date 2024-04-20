export async function GET() {
	const response = await fetch("https://example.com");

	console.log("Api call made to https://example.com");
	return new Response(await response.text());
}
