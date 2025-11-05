document.addEventListener('DOMContentLoaded', () => {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) window.location.href = 'index.html';
            
            document.getElementById('username').textContent = currentUser;
            
            if (currentUser === 'Mohand') {
                document.getElementById('adminLink').style.display = 'block';
            }
        });

        function toggleMode() {
            document.body.classList.toggle('dark-mode');
        }