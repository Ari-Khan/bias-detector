document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.querySelector('.text-input-box');
    const keyPointsList = document.getElementById('key-points-list');
    const credibilityDisplay = document.getElementById('credibilityDisplay'); // Add an element to display credibility

    inputBox.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            const prompt = inputBox.value.trim();
            if (!prompt) return;

            keyPointsList.innerHTML = '<li>Loading...</li>';

            try {
                // Fetch data from the backend (adjust URL if needed)
                const response = await fetch('https://trunalyze.vercel.app/pages/bias-detector.html', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                });

                const data = await response.json();
                console.log('Response from server:', data);

                if (data && data.response) {
                    let [point1, point2, rightBiasPercent, leftBiasPercent, credibility] = data.response.split('|').map(item => item.trim());

                    rightBiasPercent = isNaN(parseFloat(rightBiasPercent)) || parseFloat(rightBiasPercent) === 0 
                        ? 50 : parseFloat(rightBiasPercent);
                    leftBiasPercent = isNaN(parseFloat(leftBiasPercent)) || parseFloat(leftBiasPercent) === 0 
                        ? 50 : parseFloat(leftBiasPercent);

                    keyPointsList.innerHTML = `
                        <li>${point1}</li>
                        <li>${point2}</li>
                    `;

                    // Update the credibility display (for example: "Credibility: 7/10")
                    if (credibilityDisplay) {
                        credibilityDisplay.innerHTML = `Overall Credibility: ${credibility}/100`; // Display credibility score
                    }

                    // Check if the pie chart exists and destroy it before creating a new one
                    if (window.biasPieChart instanceof Chart) {
                        window.biasPieChart.destroy();  // Safely call destroy if it's a valid Chart instance
                    }

                    // Update the pie chart with the right and left bias percentages
                    const pieCtx = document.getElementById('biasPieChart').getContext('2d');
                    window.biasPieChart = new Chart(pieCtx, {
                        type: 'pie',
                        data: {
                            labels: ['Left Bias', 'Right Bias'],
                            datasets: [{
                                label: 'Bias Levels',
                                data: [parseFloat(leftBiasPercent), parseFloat(rightBiasPercent)], // Use the percentages from the response
                                backgroundColor: ['#FF6384', '#36A2EB'],
                                hoverOffset: 4
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return tooltipItem.label + ': ' + tooltipItem.raw + '%'; // Display percentage in tooltip
                                        }
                                    }
                                }
                            }
                        }
                    });

                } else {
                    keyPointsList.innerHTML = `<li>No response received.</li>`;
                }

            } catch (error) {
                console.error('Request failed:', error);
                keyPointsList.innerHTML = `<li>Something went wrong. Try again later.</li>`;
            }
        }
    });
});
