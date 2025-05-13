// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // File input preview for product uploads
  const fileInputs = document.querySelectorAll('.file-input');
  
  fileInputs.forEach(input => {
    input.addEventListener('change', function(e) {
      const previewContainer = document.getElementById(`${this.id}-preview`);
      if (!previewContainer) return;
      
      previewContainer.innerHTML = '';
      
      if (this.files) {
        Array.from(this.files).forEach(file => {
          if (file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
              const preview = document.createElement('div');
              preview.className = 'relative w-24 h-24 rounded overflow-hidden mr-2 mb-2';
              preview.innerHTML = `
                <img src="${e.target.result}" class="w-full h-full object-cover" />
              `;
              previewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
          }
        });
      }
    });
  });
  
  // Flash message auto-close
  const flashMessages = document.querySelectorAll('.flash-message');
  
  flashMessages.forEach(message => {
    setTimeout(() => {
      message.classList.add('opacity-0');
      setTimeout(() => {
        message.remove();
      }, 300);
    }, 5000);
  });
  
  // Form validation
  const forms = document.querySelectorAll('form[data-validate="true"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      const requiredInputs = form.querySelectorAll('[required]');
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          const errorElement = document.createElement('p');
          errorElement.className = 'form-error';
          errorElement.textContent = 'This field is required';
          
          // Remove any existing error messages
          const existingError = input.parentNode.querySelector('.form-error');
          if (existingError) {
            existingError.remove();
          }
          
          input.classList.add('border-red-500');
          input.parentNode.appendChild(errorElement);
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      }
    });
  });
});

// Animation on scroll
document.addEventListener('DOMContentLoaded', function() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
});