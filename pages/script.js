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
  
          const content = data.candidates[0].content.parts[0].text;
          const points = content
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.trim());
  
          keyPointsList.innerHTML = points.map(point => `<li>${point}</li>`).join('');
          
        } catch (error) {
          console.error('Request failed:', error);
          keyPointsList.innerHTML = `<li>Something went wrong. Try again later.</li>`;
        }
      }
    });
  });
  