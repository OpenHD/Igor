// CSRF Token für AJAX Requests
const csrfToken = document.querySelector("input[name='_csrf']").value;
const csrfHeader = document.querySelector("meta[name='_csrf_header']").content;

// Status Toggle
document.querySelectorAll('.status-toggle').forEach(toggle => {
    toggle.addEventListener('change', function() {
        const imageId = this.dataset.id;
        const isEnabled = this.checked;

        fetch(`/api/images/${imageId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                [csrfHeader]: csrfToken
            },
            body: JSON.stringify({ enabled: isEnabled })
        })
            .then(response => {
                if (!response.ok) {
                    this.checked = !isEnabled; // Revert on error
                    throw new Error('Update fehlgeschlagen');
                }
                return response.json();
            })
            .catch(error => console.error('Error:', error));
    });
});

// Inline Editing
document.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('click', function(e) {
        const displayText = this.querySelector('.display-text');
        const inputField = this.querySelector('.edit-input');

        if (!inputField.classList.contains('d-none')) return;

        displayText.classList.add('d-none');
        inputField.classList.remove('d-none');
        inputField.focus();

        const initialValue = inputField.value;

        const saveChanges = () => {
            const newValue = inputField.value.trim();
            if (newValue === initialValue) {
                cancelEdit();
                return;
            }

            const imageId = this.dataset.id;
            const field = this.dataset.field;

            fetch(`/api/images/${imageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify({ [field]: newValue })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Update fehlgeschlagen');
                    }
                    displayText.textContent = newValue;
                    cancelEdit();
                })
                .catch(error => {
                    console.error('Error:', error);
                    cancelEdit();
                });
        };

        const cancelEdit = () => {
            inputField.value = initialValue;
            displayText.classList.remove('d-none');
            inputField.classList.add('d-none');
        };

        inputField.addEventListener('blur', saveChanges);
        inputField.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') saveChanges();
            if (e.key === 'Escape') cancelEdit();
        });
    });
});
