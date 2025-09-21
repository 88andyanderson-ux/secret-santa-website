document.addEventListener('DOMContentLoaded', () => {
    const participantsDiv = document.getElementById('participants');
    const addParticipantBtn = document.getElementById('addParticipant');
    const santaForm = document.getElementById('santaForm');
    const resultDiv = document.getElementById('result');

    // Function to add a new participant input row
    const addParticipant = () => {
        const participantEntry = document.createElement('div');
        participantEntry.className = 'participant-entry';
        participantEntry.innerHTML = `
            <label>Name: <input type="text" class="name" required></label>
            <br>
            <label>Email: <input type="email" class="email" required></label>
            <br>
            <label>
                <input type="checkbox" class="is-adult"> Adult
            </label>
            <br>
            <label>Spouse's Name (optional): <input type="text" class="spouse-name"></label>
        `;
        participantsDiv.appendChild(participantEntry);
    };

    // Add one participant row on page load
    addParticipant();

    addParticipantBtn.addEventListener('click', addParticipant);

    santaForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const participants = [];
        document.querySelectorAll('.participant-entry').forEach(entry => {
            const name = entry.querySelector('.name').value.trim();
            const email = entry.querySelector('.email').value.trim();
            const isAdult = entry.querySelector('.is-adult').checked;
            const spouse = entry.querySelector('.spouse-name').value.trim();

            if (name && email) {
                participants.push({ name, email, isAdult, spouse });
            }
        });

        if (participants.length < 2) {
            resultDiv.innerHTML = '<p style="color:red;">Please add at least two participants.</p>';
            return;
        }

        resultDiv.innerHTML = '<p>Running the draw and sending emails... 📧</p>';

        try {
            // This is the fetch call to the Cloudflare Worker
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
