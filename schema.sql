-- 1. Adicionar coluna ilimitado à tabela existente
ALTER TABLE presentes ADD COLUMN ilimitado BOOLEAN DEFAULT false;

-- 2. Limpar dados existentes (se necessário)
-- TRUNCATE TABLE presentes;

-- 3. Inserir TODOS os presentes
-- IDs 1-6: ILIMITADOS (podem ser dados múltiplas vezes)
-- IDs 7-28: LIMITADOS (únicos, somem ao serem escolhidos)

INSERT INTO presentes (id, presente, status, ilimitado) VALUES
-- PRESENTES ILIMITADOS (aparecem sempre, sem limite)
(1, 'Jogo de Panelas (Compatíveis com indução)', 'DISPONIVEL', true),
(2, 'Conjunto de taças', 'DISPONIVEL', true),
(3, 'Cobertor/edredom de pluma sintética', 'DISPONIVEL', true),
(4, 'Aparelho de jantar', 'DISPONIVEL', true),
(5, 'Conjunto de toalhas', 'DISPONIVEL', true),
(6, 'Roupões de banho para o casal', 'DISPONIVEL', true),

-- PRESENTES LIMITADOS (únicos, requerem confirmação)
(7, 'Batedeira', 'DISPONIVEL', false),
(8, 'Cafeteira', 'DISPONIVEL', false),
(9, 'Frigobar', 'DISPONIVEL', false),
(10, 'Processador de alimentos', 'DISPONIVEL', false),
(11, 'Aspirador robô 2 em 1 Samsung', 'DISPONIVEL', false),
(12, 'Purificador de água', 'DISPONIVEL', false),
(13, 'Lava e Seca', 'DISPONIVEL', false),
(14, 'Espremedor de frutas', 'DISPONIVEL', false),
(15, 'Passadeira a vapor', 'DISPONIVEL', false),
(16, 'Ar-condicionado portátil', 'DISPONIVEL', false),
(17, 'Waffle Maker', 'DISPONIVEL', false),
(18, 'Panela Elétrica de Foundie', 'DISPONIVEL', false),
(19, 'Pillow Top Nasa', 'DISPONIVEL', false),
(20, 'Kit para Vinho', 'DISPONIVEL', false),
(21, 'Adega de Vinho 12 Garrafas', 'DISPONIVEL', false),
(22, 'Tapete de sala 4x3m', 'DISPONIVEL', false),
(23, 'Sorveteira 1,5L', 'DISPONIVEL', false),
(24, 'Churrasqueira americana', 'DISPONIVEL', false),
(25, 'Horta hidropônica', 'DISPONIVEL', false),
(26, 'Caixa de ferramentas', 'DISPONIVEL', false),
(27, 'Lixeira Inox', 'DISPONIVEL', false),
(28, 'Puff Redondo Linho', 'DISPONIVEL', false),
(29, 'Soundbar', 'DISPONIVEL', false),
(30, 'Vitrola', 'DISPONIVEL', false),
(31, 'Projetor Portátil 4K HY320', 'DISPONIVEL', false),
(32, 'Tábua para Frios e Foundie', 'DISPONIVEL', false),
(33, 'Prateleira De Banheiro Alumínio', 'DISPONIVEL', false);

-- 4. Verificar inserção
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN ilimitado = true THEN 1 ELSE 0 END) as ilimitados,
  SUM(CASE WHEN ilimitado = false THEN 1 ELSE 0 END) as limitados
FROM presentes;

-- 5. Visualizar presentes ilimitados
SELECT id, presente, ilimitado 
FROM presentes 
WHERE ilimitado = true 
ORDER BY id;

-- 6. Visualizar presentes limitados
SELECT id, presente, ilimitado 
FROM presentes 
WHERE ilimitado = false 
ORDER BY id;