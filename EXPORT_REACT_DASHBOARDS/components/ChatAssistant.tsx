'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatAssistant.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  dashboardData?: any;
  isOpen: boolean;
  onClose: () => void;
  dashboardType?: 'oficial' | 'operational' | 'predictive' | 'metrics-rollup';
}

export default function ChatAssistant({ dashboardData, isOpen, onClose, dashboardType = 'oficial' }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o assistente inteligente do dashboard. Posso ajudá-lo a entender métricas, predições ML, incidentes e muito mais. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "Quantas previsões foram geradas para o host 10084?",
    "Quantos problemas geraram tickets no ITSM?",
    "Qual threshold de previsão tem mais eventos?",
    "Quais hosts têm previsões com mais de 85% de confiança?",
    "Como estão as previsões de 'Available memory' para o host 10084?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSuggestionClick = (question: string) => {
    setInputValue(question);
    setShowSuggestions(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Envia mensagem para webhook n8n (usa basePath /dashboard)
      const response = await fetch('/dashboard/api/chat/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            dashboard: dashboardType,
            timestamp: new Date().toISOString(),
            dashboardData: JSON.parse(JSON.stringify(dashboardData || {}))
          }
        })
      });

      const data = await response.json();

      // Verifica se há erro no response
      if (!response.ok || !data.success) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.message || 'O assistente de IA está temporariamente indisponível. Por favor, verifique se o workflow N8N está ativo.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.output || 'Desculpe, não consegui processar sua mensagem.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Não foi possível conectar ao assistente de IA. Verifique se o workflow N8N está ATIVO (não apenas em modo teste). Em modo teste, o webhook funciona apenas para UMA chamada após clicar "Execute workflow".',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Janela do chat */}
      {isOpen && (
        <div className={styles.chatContainer}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.avatarIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <circle cx="9" cy="9" r="1" fill="currentColor" />
                  <circle cx="15" cy="9" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3>Assistente IA</h3>
                <span className={styles.status}>Online</span>
              </div>
            </div>
            <button
              className={styles.closeButton}
              onClick={onClose}
              title="Fechar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mensagens */}
          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageContent}>
                  <p>{message.content}</p>
                  <span className={styles.messageTime}>{formatTime(message.timestamp)}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.messageContent}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={styles.inputContainer}>
            {showSuggestions && (
              <div className={styles.suggestionsDropdown}>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className={styles.suggestionItem}
                    onClick={() => handleSuggestionClick(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
            <div className={styles.inputWrapper}>
              <button
                className={styles.suggestionsButton}
                onClick={() => setShowSuggestions(!showSuggestions)}
                title="Sugestões de perguntas"
                disabled={isLoading}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1" fill="currentColor" />
                  <circle cx="12" cy="5" r="1" fill="currentColor" />
                  <circle cx="12" cy="19" r="1" fill="currentColor" />
                </svg>
              </button>
              <textarea
                className={styles.input}
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
