document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.querySelector('.text-input-box');
    const keyPointsList = document.getElementById('key-points-list');

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

                if (data && data.response) {
                    // Split the response by '|' to get the points and bias percentages
                    const [point1, point2, rightBiasPercent, leftBiasPercent] = data.response.split('|').map(item => item.trim());

                    // Update the key points list
                    keyPointsList.innerHTML = `
                        <li>${point1}</li>
                        <li>${point2}</li>
                    `;

                    // Update the pie chart with the right and left bias percentages
                    const ctx = document.getElementById('biasPieChart').getContext('2d');
                    const biasPieChart = new Chart(ctx, {
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
