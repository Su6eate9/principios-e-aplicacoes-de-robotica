import numpy as np
import matplotlib.pyplot as plt

def cinematica_inversa(xE, yE, a1, a2):
    """
    Calcula a cinemática inversa de um braço robótico 2D com duas juntas.

    Parâmetros:
    xE, yE: Coordenadas do ponto final desejado.
    a1, a2: Comprimentos dos dois segmentos do braço robótico.

    Retorna:
    Duas soluções (q1, q2) em graus, ou None se o ponto não for alcançável.
    """

    # Verifica se a posição é alcançável
    distance = np.sqrt(xE**2 + yE**2)

    if distance > (a1 + a2) or distance < abs(a1 - a2):
        print(f"Ponto ({xE}, {yE}) não é alcançável.")
        print(f"Distância: {distance:.3f}, Alcance máximo: {a1 + a2:.3f}, Alcance mínimo: {abs(a1 - a2):.3f}")
        return None  # Ponto não alcançável

    # Calcula q2 usando a lei dos cossenos
    cos_q2 = (xE**2 + yE**2 - a1**2 - a2**2) / (2 * a1 * a2)
    sin_q2_pos = np.sqrt(1 - cos_q2**2)

    # Verifica se está no domínio válido
    if abs(cos_q2) > 1:
        print(f"Ponto ({xE}, {yE}) não é alcançável devido a valores inválidos de cosseno.")
        return None
    
    q2_sol1 = np.arctan2(sin_q2_pos, cos_q2)
    q2_sol2 = np.arctan2(-sin_q2_pos, cos_q2)

    # Calcula q1 para ambas as soluções de q2
    # Solução 1
    k1_sol1 = a1 + a2 * np.cos(q2_sol1)
    k2_sol1 = a2 * np.sin(q2_sol1)
    q1_sol1 = np.arctan2(yE, xE) - np.arctan2(k2_sol1, k1_sol1)

    # Solução 2
    k1_sol2 = a1 + a2 * np.cos(q2_sol2)
    k2_sol2 = a2 * np.sin(q2_sol2)
    q1_sol2 = np.arctan2(yE, xE) - np.arctan2(k2_sol2, k1_sol2)

    # Converte para graus
    solution1 = np.degrees(q1_sol1), np.degrees(q2_sol1)
    solution2 = np.degrees(q1_sol2), np.degrees(q2_sol2)

    return solution1, solution2

def cinematica_direta(a1, a2, q1, q2):
    """
    Calcula a cinemática direta de um braço robótico 2D com duas juntas.

    Parâmetros:
    a1, a2: Comprimentos dos dois segmentos do braço robótico.
    q1, q2: Ângulos das juntas em graus.

    Retorna:
    Posições (x0, y0), (x1, y1), (xE, yE) dos pontos do braço.
    """
    # Converte ângulos para radianos
    q1_rad = np.radians(q1)
    q2_rad = np.radians(q2)

    # Ponto base
    x0, y0 = 0, 0

    # Ponto da primeira junta
    x1 = a1 * np.cos(q1_rad)
    y1 = a1 * np.sin(q1_rad)

    # Ponto final
    x2 = x1 + a2 * np.cos(q1_rad + q2_rad)
    y2 = y1 + a2 * np.sin(q1_rad + q2_rad)

    return (x0, y0), (x1, y1), (x2, y2)

def plot_arm(a1, a2, q1, q2, xE, yE, title):
    """
    Plota o braço robótico em uma configuração específica.
    """
    # Calcula as posições dos pontos do braço usando cinemática direta
    p0, p1, p2 = cinematica_direta(a1, a2, q1, q2)

    # Cria o gráfico
    plt.figure(figsize=(8, 8))

    # Plota os segmentos do braço (LINHAS)
    plt.plot([p0[0], p1[0]], [p0[1], p1[1]], 'b-', linewidth=3, label='Elo 1')
    plt.plot([p1[0], p2[0]], [p1[1], p2[1]], 'b-', linewidth=3, label='Elo 2')

    # Plota os pontos
    plt.plot(p0[0], p0[1], 'ro', markersize=12, label="Base")
    plt.plot(p1[0], p1[1], 'ro', markersize=12, label="Junta")
    plt.plot(p2[0], p2[1], 'mo', markersize=12, label=f'Efetor calculado ({p2[0]:.3f}, {p2[1]:.3f})')

    # Plota a posição desejada do efector
    plt.plot(xE, yE, 'g*', markersize=15, label=f'Efetor desejado ({xE}, {yE})')

    # Desenha o círculo de alcance
    circle = plt.Circle((0, 0), a1 + a2, color='gray', fill=False, linestyle='--', alpha=0.3, label='Alcance máximo')
    plt.gca().add_patch(circle)

    # Configurações do gráfico
    max_reach = a1 + a2
    plt.xlim(-max_reach*1.2, max_reach*1.2)
    plt.ylim(-max_reach*1.2, max_reach*1.2)
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    plt.xlabel('X')
    plt.ylabel('Y')
    plt.title(title)
    plt.legend(loc='upper right')

def resolution_and_plot(xE, yE, a1, a2):
    print("="*60)
    print("CINEMÁTICA INVERSA - BRAÇO ROBÓTICO 2D")
    print("="*60)
    print(f"\nParâmetros do braço: a1 = {a1}, a2 = {a2}")
    print(f"Posição desejada: (xE, yE) = ({xE}, {yE})")
    
    print("\n" + "="*60)
    print("CALCULANDO CINEMÁTICA INVERSA...")
    print("="*60)

    # Resolve a cinemática inversa
    solutions = cinematica_inversa(xE, yE, a1, a2)
    if solutions is None:
        print("\nNão foi possível encontrar solução para esta posição.")
        return

    solution1, solution2 = solutions

    print(f"\nPara o braço robótico com a1 = {a1}, a2 = {a2}, a posição desejada (xE, yE) = ({xE}, {yE}) pode ser alcançada com as seguintes soluções de ângulos (em graus):")
    print(f"\nSolução 1 (cotovelo para cima): q1 = {solution1[0]:.4f}°, q2 = {solution1[1]:.4f}°")

    # Verifica a posição calculada
    _, _, pos1 = cinematica_direta(a1, a2, solution1[0], solution1[1])
    print(f"  Posição calculada do efetor: ({pos1[0]:.4f}, {pos1[1]:.4f})")
    erro1 = np.sqrt((pos1[0] - xE)**2 + (pos1[1] - yE)**2)
    print(f"  Erro de posição: {erro1:.6f}")

    print(f"\nSolução 2 (cotovelo para baixo): q1 = {solution2[0]:.4f}°, q2 = {solution2[1]:.4f}°")

    # Verifica a posição calculada
    _, _, pos2 = cinematica_direta(a1, a2, solution2[0], solution2[1])
    print(f"  Posição calculada do efetor: ({pos2[0]:.4f}, {pos2[1]:.4f})")
    erro2 = np.sqrt((pos2[0] - xE)**2 + (pos2[1] - yE)**2)
    print(f"  Erro de posição: {erro2:.6f}")

    # Plota as duas soluções
    print("\n" + "="*60)
    print("PLOTANDO CONFIGURAÇÕES DO BRAÇO ROBÓTICO...")
    print("="*60)

    plot_arm(a1, a2, solution1[0], solution1[1], xE, yE, 
             f"Solução 1: q1={solution1[0]:.2f}°, q2={solution1[1]:.2f}° (Cotovelo para cima)")
    plot_arm(a1, a2, solution2[0], solution2[1], xE, yE, 
             f"Solução 2: q1={solution2[0]:.2f}°, q2={solution2[1]:.2f}° (Cotovelo para baixo)")
    plt.show()

# Caso de uso
print("\n### Exemplo 01: Braço com a1=1, a2=2 alcançando (xE, yE)=(2, 1) ###")
resolution_and_plot(xE=2, yE=1, a1=1, a2=2)

print("\n### Exemplo 02: Braço com a1=1, a2=1 alcançando (xE, yE)=(1, 1) ###")
resolution_and_plot(xE=1, yE=1, a1=1, a2=1)

print("\n### Exemplo 03: Braço com a1=2, a2=1 alcançando (xE, yE)=(1, 2) ###")
resolution_and_plot(xE=1, yE=2, a1=2, a2=1)

# resolution_and_plot(xE=, yE=, a1=, a2=)