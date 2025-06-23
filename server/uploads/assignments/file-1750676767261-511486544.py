
# Fibonacci Series Function
def fibonacci(n):
    fib_series = []
    a, b = 0, 1
    for _ in range(n):
        fib_series.append(a)
        a, b = b, a + b
    return fib_series

# Palindrome Checker Function
def is_palindrome(s):
    s = str(s)
    return s == s[::-1]

# Example Usage
if __name__ == "__main__":
    print("Fibonacci Series (first 10 numbers):", fibonacci(10))
    test_str = "madam"
    print(f"Is '{test_str}' a palindrome?:", is_palindrome(test_str))
