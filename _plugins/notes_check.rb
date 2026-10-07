# Fails the build when a note names a field or related note that does not exist,
# so a typo can't silently drop a connection from the map.
module NotesCheck
  FIELDS = %w[music software territorio].freeze

  def self.errors_for(notes)
    ids = notes.map { |note| note.data["key"] }
    notes.flat_map { |note| note_errors(note, ids) }
  end

  def self.note_errors(note, ids)
    unknown_fields = Array(note.data["fields"]) - FIELDS
    unknown_related = Array(note.data["related"]) - ids
    errors = []
    errors << "#{note.relative_path}: unknown fields #{unknown_fields}" if unknown_fields.any?
    errors << "#{note.relative_path}: unknown related #{unknown_related}" if unknown_related.any?
    errors
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  notes = site.collections["notes"]&.docs || []
  errors = notes.group_by { |note| note.data["lang"] }.values.flat_map { |group| NotesCheck.errors_for(group) }
  raise Jekyll::Errors::FatalException, "Notes check failed:\n#{errors.join("\n")}" if errors.any?
end
