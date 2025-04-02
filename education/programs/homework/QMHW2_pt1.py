import numpy as np
import matplotlib.pyplot as plt

def safe_divide(numerator, denominator):
    # To avoid division by zero, use np.where.
    # When denominator is near zero, replace by the limit computed via derivative.
    eps = 1e-8
    # Compute the ratio normally
    ratio = np.where(np.abs(denominator) > eps, numerator/denominator, np.nan)
    # For near-zero denominator, compute derivative (l'Hopital's rule)
    # Since we know sin(x)/x ~ 1 for small x, a more specific handling is done later.
    return ratio

def f(p, n):
    # Define the two terms.
    # We have singularities at p = n*pi/2 and p = -n*pi/2.
    term1_denom = p - n*np.pi/2
    term2_denom = p + n*np.pi/2
    
    # The numerators:
    term1_num = np.sin(p/2 - n*np.pi/4)
    term2_num = np.sin(p/2 + n*np.pi/4)
    
    # Prepare output arrays for term1 and term2.
    term1 = np.empty_like(p)
    term2 = np.empty_like(p)
    
    # For term1: where denominator is close to zero, compute limit.
    idx1 = np.abs(term1_denom) < 1e-8
    term1[~idx1] = term1_num[~idx1] / term1_denom[~idx1]
    # Limit as p -> n*pi/2:
    # Let p = n*pi/2 + δ, then numerator = sin((n*pi/2 + δ)/2 - n*pi/4) = sin(δ/2)
    # and denominator = δ, so limit = (δ/2)/δ = 1/2.
    term1[idx1] = 1/2

    # For term2: where denominator is close to zero.
    idx2 = np.abs(term2_denom) < 1e-8
    term2[~idx2] = term2_num[~idx2] / term2_denom[~idx2]
    # Limit as p -> -n*pi/2:
    # Let p = -n*pi/2 + δ, then numerator = sin((-n*pi/2+δ)/2 + n*pi/4) = sin(δ/2)
    # and denominator = δ, so limit = 1/2.
    term2[idx2] = 1/2

    # Now compute f(p)
    diff = term1 - term2
    return (1/(2*np.pi)) * diff**2

# Define range for p
p = np.linspace(-10, 10, 1000)

# Plot f(p) for n = 1, 2, 3
plt.figure(figsize=(10,6))
for n in [1, 2, 3]:
    plt.plot(p, f(p, n), label=f'n = {n}')

plt.xlabel('p')
plt.ylabel('f(p)')
plt.title('Plot of f(p) for n = 1, 2, 3')
plt.legend()
plt.grid(True)
plt.show()