/**
 * Formatting and utility helpers for Majestic Club Gombe
 */

export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₦0';
  return '₦' + Math.round(amount).toLocaleString('en-NG');
}

export function formatNumber(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return Number(val).toLocaleString('en-NG');
}

export function generateRef(prefix: string): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${rand}`;
}

export function getCurrentDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentTimeStr(): string {
  return new Date().toTimeString().slice(0, 5);
}

// Generate simple SVG QR Code pattern matrix from string
export function generateQRMatrix(code: string): boolean[][] {
  const size = 21; // standard version 1 QR grid size
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // 1. Finder patterns (top-left, top-right, bottom-left 7x7 squares)
  const drawFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 || x === 6 || y === 0 || y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          matrix[startY + y][startX + x] = true;
        }
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    if (i % 2 === 0) {
      matrix[6][i] = true;
      matrix[i][6] = true;
    }
  }

  // 3. Deterministic pseudo-random fill based on hash of string code
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = ((hash << 5) - hash) + code.charCodeAt(i);
    hash |= 0;
  }

  let bitIdx = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Don't overwrite finders or timing patterns
      const inFinder1 = x < 8 && y < 8;
      const inFinder2 = x >= size - 8 && y < 8;
      const inFinder3 = x < 8 && y >= size - 8;
      const inTiming = x === 6 || y === 6;

      if (!inFinder1 && !inFinder2 && !inFinder3 && !inTiming) {
        const val = ((hash >> (bitIdx % 31)) & 1) === 1;
        matrix[y][x] = (x + y + (hash >> (bitIdx % 7))) % 2 === 0 ? !val : val;
        bitIdx++;
      }
    }
  }

  return matrix;
}

// Export array of records to downloadable CSV
export function exportToCSV(filename: string, rows: Record<string, any>[]): void {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => 
      headers.map(field => {
        let val = row[field];
        if (val === null || val === undefined) val = '';
        val = String(val).replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
