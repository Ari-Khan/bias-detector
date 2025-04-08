document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.querySelector('.text-input-box');
    const keyPointsList = document.getElementById('key-points-list');
  
    inputBox.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const prompt = inputBox.value.trim();
        if (!prompt) return;
  
        // Optional: Show loading message
        keyPointsList.innerHTML = '<li>Loading...</li>';
  
        try {
          const response = await fetch('http://trunalyze.vercel.app/bias-detector.html', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });
  
          const data = await response.json();
  
          if (response.ok) {
            const points = data.response
              .split('\n')
              .filter(line => line.trim())
              .slice(0, 2); // Ensure only two points
  
            keyPointsList.innerHTML = points.map(point => `<li>${point}</li>`).join('');
          } else {
            keyPointsList.innerHTML = `<li>Error: ${data.error}</li>`;
          }
        } catch (error) {
          console.error('Request failed:', error);
          keyPointsList.innerHTML = `<li>Something went wrong. Try again later.</li>`;
        }
      }
    });
  });
  