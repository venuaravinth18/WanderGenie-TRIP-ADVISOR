const API_KEY = "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";

// Travel Itinerary Functionality
document.getElementById("travelForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const destination = document.getElementById("destination").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Show loading spinner
  document.getElementById("loading").classList.remove("hidden");
  document.getElementById("results").classList.add("hidden");

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528:free",
          messages: [
            {
              role: "user",
              content: `Create a brief travel itinerary for ${destination} from ${startDate} to ${endDate}. 
              Requirements:
              - Maximum 3 activities per day
              - Each activity description should be 3-4 words maximum
              - Format as simple text with each line as: Day number | Time | Activity
              - Times should be in format like "9 AM" or "2 PM"
              - Do not include any special characters or formatting
              Example format:
              Day 1 | 9 AM | Visit Central Park
              Day 1 | 2 PM | Shopping at Mall
              Day 2 | 10 AM | Beach Swimming`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Hide loading spinner
    document.getElementById("loading").classList.add("hidden");

    // Process and display results
    const itineraryBody = document.getElementById("itineraryBody");
    const content = data.choices[0].message.content;

    // Clear previous content
    itineraryBody.innerHTML = "";

    // Split content into lines and filter out unwanted lines
    const lines = content
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.includes("\\boxed") &&
          !line.includes("undefined") &&
          !line.includes("{") &&
          !line.includes("}")
      );

    // Create table rows
    lines.forEach((line) => {
      if (line.trim()) {
        const [day, time, activity] = line
          .split("|")
          .map((item) => item.trim());
        // Only create row if all values are present and valid
        if (day && time && activity) {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${day}</td>
            <td>${time}</td>
            <td>${activity}</td>
          `;
          itineraryBody.appendChild(row);
        }
      }
    });

    document.getElementById("results").classList.remove("hidden");
    
    // Scroll to results
    document.getElementById("results").scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("loading").classList.add("hidden");
    showError("An error occurred while generating your itinerary. Please try again.");
  }
});

// Login Functionality
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Clear any existing errors
  const existingError = document.getElementById('loginError');
  if (existingError) existingError.remove();
  
  // Client-side validation
  if (!email || !password) {
    showLoginError('Please fill in all fields');
    return;
  }
  
  if (!validateEmail(email)) {
    showLoginError('Please enter a valid email address');
    return;
  }
  
  if (password.length < 6) {
    showLoginError('Password must be at least 6 characters');
    return;
  }
  
  // Simulate loading
  const loginBtn = document.querySelector('#loginForm button[type="submit"]');
  const originalBtnText = loginBtn.innerHTML;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
  loginBtn.disabled = true;
  
  // Simulate API call with timeout
  setTimeout(() => {
    // In a real app, this would be a fetch() to your backend
    if (email === 'demo@wandergenie.com' && password === 'demo123') {
      // Successful login - store in sessionStorage and redirect
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userEmail', email);
      window.location.href = 'index.html';
    } else {
      // Failed login
      showLoginError('Invalid email or password');
      loginBtn.innerHTML = originalBtnText;
      loginBtn.disabled = false;
    }
  }, 1500);
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showLoginError(message) {
  const errorElement = document.getElementById('loginError');
  if (!errorElement) {
    const form = document.getElementById('loginForm');
    const errorDiv = document.createElement('div');
    errorDiv.id = 'loginError';
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    form.insertBefore(errorDiv, form.firstChild);
  } else {
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  }
}

function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
  document.querySelector('.container').prepend(errorDiv);
  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

// Check authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated');
  const protectedPages = ['index.html', 'about.html']; // Pages that require auth
  
  // Check if current page is protected
  const currentPage = window.location.pathname.split('/').pop();
  
  if (protectedPages.includes(currentPage)) {
    if (!isAuthenticated) {
      window.location.href = 'login.html';
    } else {
      // Show user email in nav if logged in
      const userEmail = sessionStorage.getItem('userEmail');
      const nav = document.querySelector('.nav-links');
      if (nav && userEmail) {
        const userElement = document.createElement('span');
        userElement.className = 'user-email';
        userElement.innerHTML = `<i class="fas fa-user"></i> ${userEmail}`;
        
        // Insert before the first link
        const firstLink = nav.querySelector('a');
        if (firstLink) {
          nav.insertBefore(userElement, firstLink);
        } else {
          nav.appendChild(userElement);
        }
      }
    }
  }
  
  // Logout functionality
  document.querySelector('.logout-btn')?.addEventListener('click', function() {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    window.location.href = 'login.html';
  });
  
  // Social login buttons (simulated)
  document.querySelector('.google-btn')?.addEventListener('click', function() {
    alert('Google login would be implemented in a production app');
  });
  
  document.querySelector('.facebook-btn')?.addEventListener('click', function() {
    alert('Facebook login would be implemented in a production app');
  });
  
  // Initialize date inputs with tomorrow's date as default
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  if (document.getElementById('startDate')) {
    document.getElementById('startDate').value = formatDate(tomorrow);
    document.getElementById('startDate').min = formatDate(tomorrow);
  }
  
  if (document.getElementById('endDate')) {
    document.getElementById('endDate').value = formatDate(tomorrow);
    document.getElementById('endDate').min = formatDate(tomorrow);
  }
});