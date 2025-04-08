document.addEventListener('DOMContentLoaded', () => {
    const inputBox = document.querySelector('.text-input-box');
    const keyPointsList = document.getElementById('key-points-list');
  
    inputBox.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const prompt = inputBox.value.trim();
        if (!prompt) return;
  
        keyPointsList.innerHTML = '<li>Loading...</li>';
  
        try {
          const response = await fetch('https://trunalyze.vercel.app/pages/bias-detector.html', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });
  
          const data = await response.json();
  
          console.log(data.response);
  
          if (response.ok) {
            keyPointsList.innerHTML = `<li>${data.response}</li>`;
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
  