async function testGitHubCSV() {
  const CSV_URL = 'https://raw.githubusercontent.com/arcadep0156/interview-questions/main/devops/interview-questions.csv';

  try {
    const res = await fetch(CSV_URL);

    if (!res.ok) throw new Error("CSV not accessible");

    const text = await res.text();

    console.log("✅ CSV fetched successfully");
    console.log(text.substring(0, 200)); // preview
  } catch (error) {
    console.error("❌ Error fetching CSV:", error);
  }
}

testGitHubCSV();
