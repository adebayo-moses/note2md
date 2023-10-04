// import "./style.css";
document.addEventListener("DOMContentLoaded", () => {
  const convertForm = document.getElementById("convertForm");
  const notionUrlInput = document.getElementById("notionUrl");
  const markdownOutput = document.getElementById("markdownOutput");

  convertForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const notionUrl = notionUrlInput.value;

    try {
      const response = await fetch("/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: notionUrl }),
      });

      if (response.status === 200) {
        const markdownContent = await response.text();
        markdownOutput.value = markdownContent;
      } else {
        markdownOutput.value = "Error: Unable to convert Notion content.";
      }
    } catch (error) {
      console.error("Error:", error);
      markdownOutput.value = "Error: Unable to connect to the server.";
    }
  });
});
