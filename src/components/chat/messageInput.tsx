'use client'

export default function MessageInput(){


    return (
        <>
        <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex">
            <textarea
              className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-right resize-none"
              placeholder="پیام خود را بنویسید..."
              rows={2}
            //   value={newMessage}
            //   onChange={(e) => setNewMessage(e.target.value)}
            //   onKeyDown={handleKeyDown}
            />
            <button
              className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 h-12 flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            //   onClick={sendNewMessage}
            //   disabled={!newMessage.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 transform rotate-180"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </div>
        </div>
        </>
    )
}