import pygame
import math

class Envir:
    def _init_(self, dimentions):
        #Colors
        self.black = (0, 0, 0)
        self.white = (255, 255, 255)
        self.green = (0, 255, 0)
        self.blue = (0, 0, 255)
        self.red = (255, 0, 0)
        self.yel = (255, 255, 0)
        self.cyan = (0, 255, 255)

        #Dimensions
        self.height = dimentions[0]
        self.width = dimentions[1]

        #Window settings
        pygame.display.set_caption("Mobile robot")
        self.map = pygame.display.set_mode((self.width, self.height))

        #Text configuration
        self.font=pygame.font.Font('freesansbold.ttf', 20)
        self.text=self.font.render('default', True, self.white, self.black)
        self.textRect=self.text.get_rect()
        self.textRect.center = (dimentions[1]-600,dimentions[0]-100)

        #Trail
        self.trail_set=[]
        
    def write_info(self, x, y, theta, gama, v_star, distance):
        line1 = f"x={int(x)} y={int(y)} theta={int(math.degrees(theta))}° gama={math.degrees(gama):.2f}°"
        line2 = f"v*={v_star:.4f} m/s | Distância ao alvo: {distance:.2f} pixels"
        
        text1 = self.font.render(line1, True, self.white, self.black)
        text2 = self.font.render(line2, True, self.cyan, self.black)
        
        self.map.blit(text1, (20, self.height - 60))
        self.map.blit(text2, (20, self.height - 30))

    def trail(self, pos):
        for i in range(0, len(self.trail_set)-1):
            pygame.draw.line(self.map, self.yel, (self.trail_set[i][0], self.trail_set[i][1]), (self.trail_set[i+1][0], self.trail_set[i+1][1]))
            
        if self.trail_set._sizeof_()>10000:
            self.trail_set.pop(0)
            
        self.trail_set.append(pos)

    def robot_frame(self, pos, rotation):
        n = 80
        centerx, centery = pos
        x_axis = (centerx + n * math.cos(-rotation),
                  centery + n * math.sin(-rotation))
        y_axis = (centerx + n * math.cos(-rotation + math.pi/2),
                  centery + n * math.sin(-rotation + math.pi/2))
        pygame.draw.line(self.map, self.red, (centerx, centery), x_axis, 3)
        pygame.draw.line(self.map, self.green, (centerx, centery), y_axis, 3)
    
    def draw_target(self, target_pos):
        pygame.draw.circle(self.map, self.red, target_pos, 15, 3)
        pygame.draw.circle(self.map, self.red, target_pos, 5, 0)
        pygame.draw.line(self.map, self.red, (target_pos[0]-20, target_pos[1]), (target_pos[0]+20, target_pos[1]), 2)
        pygame.draw.line(self.map, self.red, (target_pos[0], target_pos[1]-20), (target_pos[0], target_pos[1]+20), 2)
        
class Robot:
    def _init_(self, startpos, robotImg, L, max_velocity, target_pos):
        #Meters to pixels
        self.m2p = 3779.52 

        #Velocity
        self.max_v = max_velocity * self.m2p
        self.v = 0
        self.v_star = 0  # Velocidade desejada (em m/s)
        
        #Dimensions
        self.L = L
        
        self.x = startpos[0]
        self.y = startpos[1]
        self.theta = 0
        self.gama = 0
        
        #Target position (alvo)
        self.target_x = target_pos[0]
        self.target_y = target_pos[1]
        
        #Controller gains (ganhos dos controladores)
        self.Kv = 0.001
        self.Kh = 0.2
        
        #Tolerância para considerar que chegou ao alvo
        self.tolerance = 10

        #Robot
        self.img = pygame.image.load(robotImg)
        self.rotated = self.img
        self.rect = self.rotated.get_rect(center=(self.x, self.y))

    def draw(self, map):
        map.blit(self.rotated, self.rect)
    
    def get_distance_to_target(self):
        """Calcula a distância euclidiana até o alvo"""
        return math.sqrt((self.target_x - self.x)*2 + (self.target_y - self.y)*2)
    
    def move(self, event=None):
        # CONTROLE MANUAL DESABILITADO
        # if event is not None:
        #     if event.type == pygame.KEYDOWN:
        #         #Left wheel - velocity
        #         if event.key == pygame.K_UP: #Increase
        #             self.gama+=0.005
        #         elif event.key == pygame.K_DOWN: #Decrease
        #             self.gama-=0.005
        
        # 1. Cálculo da distância ao alvo
        distance = self.get_distance_to_target()
        
        # 2. CONTROLADOR DE VELOCIDADE (v* = Kv * sqrt((x* - x)^2 + (y* - y)^2))
        # Velocidade proporcional à distância do alvo
        self.v_star = self.Kv * distance
        
        # Limita a velocidade máxima
        if self.v_star > self.max_v:
            self.v_star = self.max_v
        
        # Atualiza velocidade real
        self.v = self.v_star
        
        # 3. CONTROLADOR DE ÂNGULO DESEJADO (theta* = atan((y* - y)/(x* - x)))
        # Calcula o ângulo desejado para apontar para o alvo
        theta_star = math.atan2(self.target_y - self.y, self.target_x - self.x)
        
        # Ajuste para sistema de coordenadas do pygame (y invertido)
        theta_star = -theta_star
        
        # Controlador proporcional para o ângulo de esterçamento
        theta_error = theta_star - self.theta
        
        # Normaliza o erro angular para [-pi, pi]
        while theta_error > math.pi:
            theta_error -= 2 * math.pi
        while theta_error < -math.pi:
            theta_error += 2 * math.pi
        
        self.gama = self.Kh * theta_error
        
        # Limita o ângulo de esterçamento (limites físicos do robô)
        max_gama = math.radians(45)
        if self.gama > max_gama:
            self.gama = max_gama
        elif self.gama < -max_gama:
            self.gama = -max_gama
        
        # Parar quando estiver próximo ao alvo
        if distance < self.tolerance:
            self.v = 0
            self.v_star = 0
            self.gama = 0
        
        self.x += self.v * math.cos(self.theta) * dt
        self.y -= self.v * math.sin(self.theta) * dt
        self.theta += ((self.v * math.tan(self.gama)) / self.L) * dt

        #Reset theta (mantém entre -2pi e 2pi)
        if(self.theta > 2*math.pi or self.theta < -2*math.pi):
            self.theta = 0

        #Change in orientation
        self.rotated = pygame.transform.rotozoom(self.img, math.degrees(self.theta), 1)
        self.rect = self.rotated.get_rect(center=(self.x, self.y))
                
#Initialisation
pygame.init()

#Dimensions
dims = (600, 1200)

#Status
running = True

#Environment
environment = Envir(dims)


target_position = (200, 300)

#Robot
start_pos = (900, 300)
img_add = "robo.png"
robot_length = 1
max_robot_speed = 0.05
robot = Robot(start_pos, img_add, robot_length, max_robot_speed, target_position)

#dt
dt = 0
lasttime = pygame.time.get_ticks()

while running:
    #Verify events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        robot.move(event)

    #Time change
    dt = (pygame.time.get_ticks() - lasttime)/1000
    lasttime = pygame.time.get_ticks()
    
    #Update
    pygame.display.update()
    environment.map.fill(environment.black)
    robot.move()

    # Calcula distância para mostrar na tela
    distance_to_target = robot.get_distance_to_target()
    
    environment.write_info(robot.x, robot.y, robot.theta, robot.gama, 
                          robot.v_star / robot.m2p, distance_to_target)

    robot.draw(environment.map)
    environment.robot_frame((robot.x, robot.y), robot.theta)
    environment.trail((robot.x, robot.y))
    
    # Desenha o alvo
    environment.draw_target(target_position)

#Close pygame window
pygame.quit()