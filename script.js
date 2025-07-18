// Cofman Law - Custom JS

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    var menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            var menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.toggle('hidden');
        });
    }
    // Close mobile menu on link click
    var mobileMenuLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            var menu = document.getElementById('mobile-menu');
            if (menu) menu.classList.add('hidden');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            var targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                var mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // IntersectionObserver for fade-in/scale-in animations
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('animate-fadein-up')) {
                        entry.target.classList.add('animate-fadein-up-active');
                        entry.target.classList.remove('animate-fadein-up');
                    }
                    if (entry.target.classList.contains('animate-fadein-scale')) {
                        entry.target.classList.add('animate-fadein-scale-active');
                        entry.target.classList.remove('animate-fadein-scale');
                    }
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('.animate-fadein-up').forEach(function(el) { observer.observe(el); });
        document.querySelectorAll('.animate-fadein-scale').forEach(function(el) { observer.observe(el); });
    }

    // Contact form validation and AJAX submission
    var contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        var firstName = document.getElementById('firstName');
        var lastName = document.getElementById('lastName');
        var contactFromName = document.getElementById('contactFromName');
        var email = document.getElementById('email');
        var service = document.getElementById('service');
        var firstNameError = document.getElementById('firstNameError');
        var emailError = document.getElementById('emailError');
        var serviceError = document.getElementById('serviceError');
        var contactSuccessModal = document.getElementById('contactSuccessModal');
        var closeContactSuccess = document.getElementById('closeContactSuccess');

        function validateEmail(emailValue) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var valid = true;
            if (!firstName.value.trim()) {
                firstNameError.classList.remove('hidden');
                valid = false;
            } else {
                firstNameError.classList.add('hidden');
            }
            if (!email.value.trim() || !validateEmail(email.value.trim())) {
                emailError.classList.remove('hidden');
                valid = false;
            } else {
                emailError.classList.add('hidden');
            }
            if (!service.value) {
                serviceError.classList.remove('hidden');
                valid = false;
            } else {
                serviceError.classList.add('hidden');
            }
            if (!valid) return false;
            contactFromName.value = firstName.value + (lastName.value ? (' ' + lastName.value) : '');
            var formData = new FormData(contactForm);
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success) {
                    contactForm.reset();
                    if (contactSuccessModal) contactSuccessModal.classList.remove('hidden');
                } else {
                    alert('There was an error. Please try again later.');
                }
            })
            .catch(function() {
                alert('There was an error. Please try again later.');
            });
        });
        // Close modal logic
        if (closeContactSuccess) {
            closeContactSuccess.addEventListener('click', function() {
                contactSuccessModal.classList.add('hidden');
            });
        }
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && contactSuccessModal) contactSuccessModal.classList.add('hidden');
        });
        if (contactSuccessModal) {
            contactSuccessModal.addEventListener('click', function(e) {
                if (e.target === contactSuccessModal) contactSuccessModal.classList.add('hidden');
            });
        }
    }

    // Quick Question Modal logic (if present)
    var quickQuestionModal = document.getElementById('quickQuestionModal');
    var openQuickQuestionBtns = document.querySelectorAll('a,button');
    var closeQuickQuestion = document.getElementById('closeQuickQuestion');
    var quickQuestionForm = document.getElementById('quickQuestionForm');
    var quickQuestion = document.getElementById('quickQuestion');
    var quickQuestionError = document.getElementById('quickQuestionError');
    var quickQuestionSuccess = document.getElementById('quickQuestionSuccess');
    var quickName = document.getElementById('quickName');
    var quickFromName = document.getElementById('quickFromName');

    if (quickQuestionModal && quickQuestionForm) {
        openQuickQuestionBtns.forEach(function(btn) {
            if (btn.textContent && btn.textContent.trim().toLowerCase() === 'send a quick question') {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    quickQuestionModal.classList.remove('hidden');
                    quickQuestionSuccess.classList.add('hidden');
                    quickQuestion.value = '';
                    quickQuestionError.classList.add('hidden');
                    if (quickName) quickName.value = '';
                });
            }
        });
        if (closeQuickQuestion) {
            closeQuickQuestion.addEventListener('click', function() {
                quickQuestionModal.classList.add('hidden');
            });
        }
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') quickQuestionModal.classList.add('hidden');
        });
        quickQuestionModal.addEventListener('click', function(e) {
            if (e.target === quickQuestionModal) quickQuestionModal.classList.add('hidden');
        });
        quickQuestionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!quickQuestion.value.trim()) {
                quickQuestionError.classList.remove('hidden');
                return false;
            } else {
                quickQuestionError.classList.add('hidden');
            }
            quickFromName.value = quickName.value;
            var formData = new FormData(quickQuestionForm);
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.success) {
                    quickQuestionSuccess.classList.remove('hidden');
                    quickQuestionForm.reset();
                    setTimeout(function() { quickQuestionModal.classList.add('hidden'); }, 1500);
                } else {
                    quickQuestionSuccess.classList.remove('hidden');
                    quickQuestionSuccess.textContent = 'There was an error. Please try again later.';
                }
            })
            .catch(function() {
                quickQuestionSuccess.classList.remove('hidden');
                quickQuestionSuccess.textContent = 'There was an error. Please try again later.';
            });
        });
    }
}); 