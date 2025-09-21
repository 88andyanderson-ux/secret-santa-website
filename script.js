document.addEventListener('DOMContentLoaded', () => {
    // ... (rest of the front-end code remains the same) ...

    santaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const participants = [];
        document.querySelectorAll('.participant-entry').forEach(entry => {
            const name = entry.querySelector('.name').value.trim();
            const isAdult = entry.querySelector('.is-adult').checked;
            const spouse = entry.querySelector('.spouse-name').value.trim();
            const email = entry.querySelector('.email').value.trim(); // Add an email input field in your HTML
            if (name && email) {
                participants.push({ name, isAdult, spouse, email });
            }
        });

        if (participants.length < 2) {
            resultDiv.innerHTML = '<p style="color:red;">Please add at least two participants.</p>';
            return;
        }

        resultDiv.innerHTML = '<p>Running the draw and sending emails...</p>';

        try {
            const response = await fetch('/api/draw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ participants })
            });

            const data = await response.json();
            if (response.ok) {
                resultDiv.innerHTML = `<p style="color:green;">${data.message}</p>`;
            } else {
                resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<p style="color:red;">An error occurred: ${error.message}</p>`;
        }
    });
});