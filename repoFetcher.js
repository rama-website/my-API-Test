// repoFetcher.js
export async function fetchUserRepos(userName) {
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error(error);
        return null; // Return null to indicate an error
    }
}
