export const isPrime = (n: number): boolean => {
  if (n <= 1) return false
  if (n <= 3) return true
  if (n % 2 === 0 || n % 3 === 0) return false

  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false
  }
  return true
}

export const getPrimesUpTo = (max: number): number[] => {
  const primes: number[] = []
  for (let i = 2; i <= max; i++) {
    if (isPrime(i)) primes.push(i)
  }
  return primes
}

export const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b)
}

export const lcm = (a: number, b: number): number => {
  return (a * b) / gcd(a, b)
}

export const factorial = (n: number): number => {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}
