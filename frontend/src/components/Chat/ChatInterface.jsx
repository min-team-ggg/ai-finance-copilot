import { useState } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { sendChatMessage } from '../../services/api'

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: 'Hi! I\'m your Finance Copilot. How can I help you today?' },
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = { id: Date.now(), role: 'user', text: inputValue }
    setMessages([...messages, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await sendChatMessage(inputValue)
      const botMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: response.message || response.response || 'I understand your question. Let me analyze your spending data and provide insights.',
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Failed to send chat message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        text: 'Sorry, I encountered an error processing your request. Please try again later.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface rounded-lg shadow-sm border border-gray-200 flex flex-col h-80 sm:h-96">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-text-primary">AI Assistant</h3>
        <p className="text-sm text-text-secondary">Ask me anything about your finances</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user' ? 'bg-primary text-white' : 'bg-success text-white'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5" />
              ) : (
                <Bot className="w-5 h-5" />
              )}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-text-primary'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about your spending..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  )
}
