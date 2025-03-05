export function displayToast(container: HTMLElement, message: string){
           
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000); // Auto-hide after 3s
} 