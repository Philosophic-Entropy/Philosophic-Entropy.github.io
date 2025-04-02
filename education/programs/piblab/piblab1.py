import numpy as np
import matplotlib.pyplot as plt

def huckel_matrix(n: int, alpha: float = 0.0, beta: float = -2.9):
    """
    Constructs the Hückel Hamiltonian matrix for a cyclic conjugated system with n atoms.
    :param n: Number of conjugated atoms (e.g., 6 for benzene, 18 for porphyrin core).
    :param alpha: Coulomb integral (default 0.0 eV).
    :param beta: Resonance integral (default -2.9 eV).
    :return: Hückel Hamiltonian matrix.
    """
    H = np.full((n, n), alpha)
    for i in range(n):
        H[i, (i+1) % n] = beta  # Nearest neighbor coupling
        H[(i+1) % n, i] = beta  # Ensure Hermitian symmetry
    return H

def solve_huckel(n: int):
    """
    Solve the Hückel matrix and return MO energies and the HOMO-LUMO gap.
    """
    H = huckel_matrix(n)
    energies, _ = np.linalg.eigh(H)  # Solve eigenvalue problem
    homo = n // 2 - 1  # Index of HOMO
    lumo = homo + 1  # Index of LUMO
    homo_lumo_gap = energies[lumo] - energies[homo]
    return energies, homo_lumo_gap

def estimate_absorption(n: int):
    """
    Estimate the absorption wavelength (nm) based on the HOMO-LUMO gap.
    """
    energies, gap = solve_huckel(n)
    if gap > 0:
        wavelength_nm = 1240 / gap  # Convert eV to nm
    else:
        wavelength_nm = np.inf  # Avoid division by zero
    return energies, gap, wavelength_nm

# Example: Benzene (6-membered ring)
n_atoms = 18
eigenvalues, gap, absorbance_nm = estimate_absorption(n_atoms)

print(f"Molecular Orbital Energies (eV): {np.round(eigenvalues, 2)}")
print(f"HOMO-LUMO Gap: {gap:.2f} eV")
print(f"Estimated Absorption Wavelength: {absorbance_nm:.2f} nm")

# Plot Energy Levels
plt.figure(figsize=(5, 4))
y_vals = np.arange(len(eigenvalues))
plt.scatter(eigenvalues, y_vals, color='b', marker='o', label='MO Energy Levels')
plt.axhline(y=n_atoms//2-1, color='r', linestyle='--', label='HOMO')
plt.axhline(y=n_atoms//2, color='g', linestyle='--', label='LUMO')
plt.xlabel('Energy (eV)')
plt.ylabel('Molecular Orbital Index')
plt.title(f'Hückel MO Spectrum for {n_atoms}-membered Ring')
plt.legend()
plt.grid()
plt.show()