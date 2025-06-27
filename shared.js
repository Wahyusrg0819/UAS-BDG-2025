// Shared utilities for Neo4j Recipe Visualization

// Create error modal
function createErrorModal() {
    var modalDiv = document.createElement("div");
    modalDiv.setAttribute("id", "modal");
    modalDiv.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        padding-top: 100px;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
    `;

    var modalContentDiv = document.createElement("div");
    modalContentDiv.setAttribute("id", "modal-content");
    modalContentDiv.style.cssText = `
        background-color: #fefefe;
        color: #2e3138;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        border-radius: 12px;
        width: 80%;
        max-width: 500px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.3);
        animation: modalSlideIn 0.3s ease;
    `;

    var errorTitleP = document.createElement("h3");
    errorTitleP.setAttribute("id", "error-title");
    errorTitleP.innerText = "⚠️ Connection Error";
    errorTitleP.style.cssText = `
        color: #e74c3c;
        margin-bottom: 1rem;
        font-size: 1.5rem;
    `;

    var errorDescP = document.createElement("p");
    errorDescP.innerText = "An error occurred while trying to connect to Neo4j database. Please check your configuration:";
    errorDescP.style.cssText = `
        margin-bottom: 1rem;
        line-height: 1.6;
    `;

    var errorContentP = document.createElement("p");
    var errorContentCode = document.createElement("code");
    errorContentCode.setAttribute("id", "error-content");
    errorContentCode.style.cssText = `
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        display: block;
        margin: 1rem 0;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: #e74c3c;
    `;

    var retryButton = document.createElement("button");
    retryButton.innerText = "🔄 Retry Connection";
    retryButton.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 25px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        margin-top: 1rem;
        transition: all 0.3s ease;
    `;

    retryButton.addEventListener('click', function() {
        location.reload();
    });

    retryButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
    });

    retryButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });

    errorContentP.appendChild(errorContentCode);
    modalContentDiv.appendChild(errorTitleP);
    modalContentDiv.appendChild(errorDescP);
    modalContentDiv.appendChild(errorContentP);
    modalContentDiv.appendChild(retryButton);

    modalDiv.appendChild(modalContentDiv);
    document.body.appendChild(modalDiv);

    return modalDiv;
}

// Add CSS animation keyframes
function addModalAnimations() {
    var style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize error modal when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addModalAnimations();
    createErrorModal();
});

// Utility functions for better error handling
window.showError = function(message) {
    var modal = document.getElementById("modal");
    var errorContent = document.getElementById("error-content");
    
    if (modal && errorContent) {
        errorContent.innerText = message;
        modal.style.display = "block";
    }
};

window.hideError = function() {
    var modal = document.getElementById("modal");
    if (modal) {
        modal.style.display = "none";
    }
};

// Add click outside modal to close functionality
document.addEventListener('click', function(event) {
    var modal = document.getElementById("modal");
    if (event.target === modal) {
        hideError();
    }
});

// Add escape key to close modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideError();
    }
});

console.log("✅ Shared utilities loaded successfully!");
