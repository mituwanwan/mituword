describe('通用工具函数', () => {
  describe('日期格式化', () => {
    it('应正确格式化日期', () => {
      const date = new Date('2026-06-05');
      const formatted = date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      expect(formatted).toBe('2026年6月5日');
    });
  });

  describe('字符串工具', () => {
    it('应正确截取字符串', () => {
      const str = '这是一段很长的文本内容';
      const truncated = str.slice(0, 5) + '...';
      expect(truncated).toBe('这是一段很...');
    });

    it('空值处理应安全', () => {
      const value: string | null = null;
      const result = value ?? '';
      expect(result).toBe('');
    });
  });

  describe('数组工具', () => {
    it('应正确过滤数组', () => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter((x) => x > 2);
      expect(filtered).toEqual([3, 4, 5]);
    });

    it('应正确截取数组', () => {
      const arr = [1, 2, 3, 4, 5];
      const sliced = arr.slice(0, 3);
      expect(sliced).toEqual([1, 2, 3]);
    });
  });
});
