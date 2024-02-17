/**
 * Select an html element from DOM.
 * @param {string} selector 
 * @returns {HTMLElement}
 */
export const element = (selector, parent = document) => {
    return parent.querySelector(selector)
}

/**
 * Attach an event listeners.
 * @param {HTMLElement} element 
 * @param {string} event
 * @param {Function} fn 
 * @param {Object} options 
 */
export const listen = (element, event, fn, options) => {
    element.addEventListener(event, fn, options)

    return () => {
        element.removeEventListener(event, fn, options)
    }
}

/**
 * Show an alert message
 * @param {string} message 
 * @param {number} timer 
 */
export const showAlert = ({ message, timer = 3000 }) => {
    const messageElement = document.createElement('div');
    messageElement.className = 'alert__message card';
    messageElement.textContent = message;

    // add it in the dom.
    element('.alert').appendChild(messageElement)
    setTimeout(() => { messageElement.classList.add('show') }, 50)

    // we'll remove it after specified time
    setTimeout(() => {
        element('.alert').removeChild(messageElement)
    }, timer)
}

/**
 * Show a modal with specified fields.
 * @param {object} param0 
 */
export const showModal = ({
    heading,
    paragraph,
    input,
    cancelBtn = 'cancel',
    submitBtn = 'submit'
}) => {
    const modal = element('.modal__dailog')

    modal.innerHTML = `
        <h3>${heading}</h3>
        ${paragraph ? `<p>${paragraph}</p>` : ''}
        ${input ? `<input type="text" class="input" placeholder="${input}">` : ''}

        <div class="modal__group">
            <button class="button button_secondry modal__cancel" title="Create" type="button">
                ${cancelBtn}
            </button>
            <button class="button button_primary modal__submit" title="Create" type="button">
                ${submitBtn}
            </button>
        </div>
    `;

    let resolve, globalEvent, cancelEvent, submitEvent;
    const resetFn = () => {
        // '.innerHTML=""' will remove elements and its listeners also, but in older browser it may result in data leak
        // so we need to remove all listeners from the elements.
        globalEvent();
        cancelEvent();
        submitEvent();

        modal.parentNode.classList.remove('show');
        setTimeout(() => { modal.innerHTML = '' }, 50);
    }

    const onCancel = () => {
        resetFn();
        resolve(null);
    }

    const onSubmit = () => {
        const input = element('input', modal);
        resolve(input ? input.value : true);
        resetFn()
    }

    // If user clicked outside the modal
    globalEvent = listen(element('.modal'), 'click', (event) => {
        (event.target.className.startsWith('modal show') && onCancel());
    })

    cancelEvent = listen(element('.modal__cancel', modal), 'click', onCancel)
    submitEvent = listen(element('.modal__submit', modal), 'click', onSubmit)

    setTimeout(() => {
        modal.parentNode.classList.add('show')
    }, 50)

    return new Promise((res) => (resolve = res));
}

/**
 * Store and get localstorage value
 * @param {string} key 
 */
export const localStorage = (key) => {
    const DEFAULT = 'fb__';

    return (val) => {
        if (val == undefined) {
            return JSON.parse(window.localStorage.getItem(DEFAULT + key) || '{"value": null}').value;
        }
        else if (val == null) {
            window.localStorage.removeItem(DEFAULT + key)
        }
        else {
            window.localStorage.setItem(DEFAULT + key, JSON.stringify({ value: val }))
        }
    }
}

/**
 * Convert JSON file into a downloadable file.
 * @param {object} data 
 */
export const exportDataInJSONFile = (data) => {
    console.log(data)

    const dataStr = JSON.stringify(data);
    const blob = new Blob([dataStr], { type: "application/json" });

    // Create a link element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = data.title;

    // Simulate a click on the link to trigger the download
    link.click();

    // Revoke the object URL after the download is complete
    // So it can release memory of URL BLOB.
    setTimeout(() => {
        URL.revokeObjectURL(link.href);
    }, 100);
}