let playerIndex = 5; // Starting index after initial 5 players
const loadingSpinner = `
    <div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100%;">
        <div class="spinner-border text-success" role="status"></div>
    </div>
`;

function loadMorePlayers() {
    const loadMoreCard = document.getElementById("load-more-card");
    loadMoreCard.innerHTML = loadingSpinner; // Show green loading spinner
    
    fetch("/load_more")
        .then(response => response.json())
        .then(players => {
            const container = document.getElementById("player-cards");
            const nextPlayers = players.slice(playerIndex, playerIndex + 5);

            nextPlayers.forEach(player => {
                const cardHtml = `
                    <div class="col-md-6 col-lg-4 mb-4 player-card">
                        <div class="card h-100 text-center shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${player.Player}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${player.Team} - ${player.Position}</h6>
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item"><strong>Market Value:</strong> €${player["Market Value"].toFixed(2)}</li>
                                    <li class="list-group-item"><strong>Price Increase:</strong> €${player["Price Increase"].toFixed(2)}</li>
                                    <li class="list-group-item"><strong>Value Increase Ratio:</strong> ${player["Value Increase Ratio"].toFixed(2)}%</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', cardHtml);
            });

            // Update player index for next load and reset load-more card with + icon
            playerIndex += 5;
            loadMoreCard.innerHTML = `
                <div class="card h-100 text-center shadow-sm load-more-card" style="cursor: pointer;" onclick="loadMorePlayers()">
                    <div class="card-body d-flex align-items-center justify-content-center">
                        <span class="material-icons" style="font-size: 3em; color: #2E7D32;">add</span>
                    </div>
                </div>`;

            // Move load-more card to the end of the row
            container.appendChild(loadMoreCard);

            // Hide the "+ card" if all players have been displayed
            if (playerIndex >= players.length) {
                loadMoreCard.style.display = "none";
            }
        })
        .catch(error => {
            console.error("Error loading players:", error);
            loadMoreCard.innerHTML = `<span style="color: red;">Failed to load more players</span>`;
        });
}
