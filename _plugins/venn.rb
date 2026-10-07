# Places note titles inside the regions of a three-circle Venn diagram
# (viewBox 0 0 360 340). Used by _includes/venn.html.
module Venn
  REGION_CENTERS = {
    %w[music] => [82, 92],
    %w[software] => [278, 92],
    %w[territorio] => [180, 288],
    %w[music software] => [180, 78],
    %w[music territorio] => [114, 206],
    %w[software territorio] => [246, 206],
    %w[music software territorio] => [180, 158]
  }.freeze
  LINE_HEIGHT = 12
  NOTE_GAP = 4
  WRAP_AT = 11

  def venn_labels(notes)
    notes.group_by { |note| note["fields"].sort }.flat_map do |fields, group|
      center = REGION_CENTERS.fetch(fields)
      place(group.map { |note| label(note) }, center)
    end
  end

  private

  def label(note)
    {"key" => note["key"], "lines" => wrap(note["title"])}
  end

  def place(labels, (x, y))
    heights = labels.map { |l| l["lines"].size * LINE_HEIGHT + NOTE_GAP }
    top = y - heights.sum / 2.0 + LINE_HEIGHT * 0.75
    labels.each_with_index.map do |l, i|
      l.merge("x" => x, "y" => (top + heights.first(i).sum).round(1))
    end
  end

  def wrap(title)
    title.split.each_with_object([]) do |word, lines|
      if lines.any? && "#{lines.last} #{word}".size <= WRAP_AT
        lines[-1] = "#{lines.last} #{word}"
      else
        lines << word
      end
    end
  end
end

Liquid::Template.register_filter(Venn)
