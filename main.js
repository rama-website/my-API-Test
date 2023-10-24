// Import necessary functions from external modules
import { fetchUserData } from './userFetcher.js';
import { fetchUserRepos } from './repoFetcher.js';

// Wait for the DOM to be fully loaded.
document.addEventListener('DOMContentLoaded', () => {

     // Get references to various HTML elements.
    const searchButton = document.getElementById('search');
    const seeReposButton = document.getElementById('see-repos');
    const usernameInput = document.getElementById('username');
    const userInfoContainer = document.getElementById('user-info');
    let reposList;

    // Function to display error messages in the user info container.
    function displayErrorMessage(message) {
        userInfoContainer.innerHTML = `<p>${message}</p>`;
    }

    // Check if a GitHub user exists
    async function checkUserExists(userName) {
        const response = await fetch(`https://api.github.com/users/${userName}`);
        if (response.status === 200) {
            return true; // User exists
        } else if (response.status === 404) {
            return false; // User doesn't exist
        } else {
            throw new Error('Error checking user existence');
        }
    }

    // Display user data in the user info container.
    async function displayUserData(userData) {
        userInfoContainer.innerHTML = `
            <h2>${userData.login}</h2>
            <img src="${userData.avatar_url}" alt="${userData.login}'s avatar">
            <h3>Repositories:</h3>
            <ul id="repos"></ul>
        `;

        // Fetch and display user repositories.
        fetchReposAndDisplay(userData.login);

        // Now that we've displayed user info, show the "See Repos" button
        seeReposButton.style.display = 'inline';
    }

    // Hide the "See Repos" button initially.
    seeReposButton.style.display = 'none'; // Hide the button initially

    // Event listener for the "See Repos" button.
    seeReposButton.addEventListener('click', () => {
        const userName = usernameInput.value;
        reposList = document.getElementById('repos');

        if (userName) {

            // Fetch and display user repositories.
            fetchReposAndDisplay(userName);
        } else {
            displayErrorMessage('Please enter a GitHub username.');
        }
    });

    // Event listener for the "Search" button.
    searchButton.addEventListener('click', async () => {
        const userName = usernameInput.value;

        if (userName) {

            // Check if the user exists
            const userExists = await checkUserExists(userName);

            if (userExists) {

                  // If the user exists, fetch their data.
                const userData = await fetchUserData(userName);
                if (userData) {
                    displayUserData(userData);
                } else {
                    displayErrorMessage('Error fetching user data.');
                }
            } else {
                displayErrorMessage('This user does not have a GitHub account.');
            }
        } else {
            displayErrorMessage('Please enter a GitHub username.');
        }
    });

    // Fetch and display user repositories.
    async function fetchReposAndDisplay(userName) {
        if (reposList) {
            const reposData = await fetchUserRepos(userName);
            if (reposData) {
                reposList.innerHTML = '';
                reposData.forEach((repo) => {
                    const repoItem = document.createElement('li');
                    repoItem.textContent = repo.name;
                    reposList.appendChild(repoItem);
                });
            }
        }
    }
});
