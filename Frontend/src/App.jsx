import { useState, useRef } from "react";
import "./App.css";
import axios from "axios";
import Markdown from "react-markdown";
import { ClipLoader } from "react-spinners";
import Editor from "@monaco-editor/react";

function App() {
  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef(null);

  const languages = [
    {
      label: "JavaScript",
      value: "javascript",
    },
    {
      label: "Python",
      value: "python",
    },
    {
      label: "Java",
      value: "java",
    },
    {
      label: "C++",
      value: "cpp",
    },
    {
      label: "C",
      value: "c",
    },
    {
      label: "TypeScript",
      value: "typescript",
    },
  ];

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editor.focus();
  }

  function handleLanguageChange(event) {
    const newLanguage = event.target.value;

    setLanguage(newLanguage);

    const exampleCode = {
      javascript: `function sum(a, b) {
  return a + b;
}`,

      python: `def sum(a, b):
    return a + b`,

      java: `public class Main {
    public static int sum(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        System.out.println(sum(10, 20));
    }
}`,

      cpp: `#include <iostream>
using namespace std;

int main() {
    int a = 10;
    int b = 20;

    cout << a + b << endl;

    return 0;
}`,

      c: `#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;

    printf("%d", a + b);

    return 0;
}`,

      typescript: `function sum(a: number, b: number): number {
  return a + b;
}`,
    };

    setCode(exampleCode[newLanguage]);
  }

  async function reviewCode() {
    try {
      setLoading(true);
      setError("");
      setReview("");

      if (!editorRef.current) {
        setError("Editor is not ready. Please try again.");
        return;
      }

      const currentCode = editorRef.current.getValue();

      if (!currentCode.trim()) {
        setError("Please enter some code before analyzing.");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL;

      const response = await axios.post(
        `${API_URL}/ai/get-review`,
        {
          language: language,
          code: currentCode,
        }
      );

      setReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);

      if (error.response) {
        setError(
          `Server error: ${error.response.status}. Please check your backend.`
        );
      } else if (error.request) {
        setError(
          "Cannot connect to backend. Make sure the backend server is running."
        );
      } else {
        setError(
          "Failed to get review. Please check your connection and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Code Review</h1>

        <div className="header-controls">
          <button
            className="review-button"
            onClick={reviewCode}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader size={20} color="#ffffff" />
            ) : (
              "Analyze Code"
            )}
          </button>
        </div>
      </header>

      <div className="main-content">
        <div className="editor-panel">
          <div className="editor-header">
            <h2>Code Editor</h2>

            <select
              className="language-selector"
              value={language}
              onChange={handleLanguageChange}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="code-editor-container">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              theme="vs-dark"
              options={{
                minimap: {
                  enabled: false,
                },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorStyle: "line",
                cursorBlinking: "smooth",
                wordWrap: "on",
                tabSize: 2,
              }}
            />
          </div>
        </div>

        <div className="review-panel">
          <div className="review-header">
            <h2>Code Analysis</h2>

            <div className="status-indicator">
              {error && (
                <span className="error-message">
                  {error}
                </span>
              )}
            </div>
          </div>

          <div className="review-content">
            {review ? (
              <Markdown
                components={{
                  code({
                    node,
                    inline,
                    className,
                    children,
                    ...props
                  }) {
                    return (
                      <code
                        className={className}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {review}
              </Markdown>
            ) : (
              <div className="empty-state">
                <p>
                  Your code analysis will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;