import numpy as np
import matplotlib.pyplot as plt

def f_p(p, n):
    """
    Compute the probability density f(p) using:
    - The sum formula for odd n.
    - The difference formula for even n.
    """
    term1_denom = p - n * np.pi / 2
    term2_denom = p + n * np.pi / 2

    term1_num = np.sin(p / 2 - n * np.pi / 4)
    term2_num = np.sin(p / 2 + n * np.pi / 4)

    # Allocate arrays for term1 and term2
    term1 = np.empty_like(p)
    term2 = np.empty_like(p)

    # A small epsilon to avoid division by zero.
    eps = 1e-8

    # Identify indices where denominator is nearly zero
    idx1 = np.abs(term1_denom) < eps
    idx2 = np.abs(term2_denom) < eps

    # Compute term1 away from singularity
    term1[~idx1] = term1_num[~idx1] / term1_denom[~idx1]
    term1[idx1] = 0.5  # Limit

    # Compute term2 away from singularity
    term2[~idx2] = term2_num[~idx2] / term2_denom[~idx2]
    term2[idx2] = 0.5  # Limit

    # Use sum for odd n, difference for even n
    if n % 2 == 1:  
        psi_p = (1 / np.sqrt(2 * np.pi)) * (term1 + term2)
    else:  
        psi_p = (1 / np.sqrt(2 * np.pi)) * (term1 - term2)

    return psi_p**2

# Define a range of p values
p = np.linspace(-10, 10, 1000)

# Plot f(p) for n = 1, 2, 3, 4 (testing both odd and even cases)
plt.figure(figsize=(10, 6))

for n in [1, 2, 3, 4]:
    f_vals = f_p(p, n)
    plt.plot(p, f_vals, label=f'n = {n}')

plt.xlabel('p')
plt.ylabel('f(p)')
plt.title('Probability Density f(p) with Corrected Formula for Odd/Even n')
plt.legend()
plt.grid()
plt.show()