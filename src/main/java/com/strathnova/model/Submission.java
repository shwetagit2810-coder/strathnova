package com.strathnova.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * One row per form submission, from either mode. {@link #mode} and
 * {@link #formType} are columns because every query needs to filter on them;
 * everything else about the submission, including who sent it (name, email,
 * message) and whatever is specific to that mode's form (chip picks,
 * selected category, urgency, ...), lives in {@link #details} as JSON so a
 * new field never needs a schema change. {@link #status} tracks where the
 * lead stands and is updated after the row is created.
 */
@Entity
@Table(name = "submission")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 1)
    private SubmissionMode mode;

    @Column(name = "form_type", nullable = false)
    private String formType;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> details;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private LeadStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Submission() {
    }

    public Submission(SubmissionMode mode, String formType, Map<String, Object> details) {
        this.mode = mode;
        this.formType = formType;
        this.details = details;
        this.status = LeadStatus.NEW;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public SubmissionMode getMode() {
        return mode;
    }

    public String getFormType() {
        return formType;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    private static final Set<String> CONTACT_DETAIL_KEYS = Set.of("name", "email", "message");

    /** A human-readable label plus one or more display lines for one {@link #details} entry. */
    public record DetailField(String label, List<String> lines) {
    }

    /**
     * Everything in {@link #details} beyond the contact fields already shown in
     * their own columns - e.g. problem, category, urgency for the diagnostic
     * flow, or role/stage/timing for the other forms. Which keys are present
     * depends entirely on {@link #formType}, so this stays generic rather than
     * naming individual fields; multi-pick lists (like the "problems" chip
     * picks) become one line per pick instead of a flattened key=value dump.
     */
    public List<DetailField> getExtraDetails() {
        List<DetailField> fields = new ArrayList<>();
        if (details != null) {
            details.forEach((key, value) -> {
                if (!CONTACT_DETAIL_KEYS.contains(key) && value != null) {
                    fields.add(new DetailField(humanize(key), formatLines(value)));
                }
            });
        }
        return fields;
    }

    private static String humanize(String key) {
        String spaced = key.replaceAll("([a-z0-9])([A-Z])", "$1 $2");
        return Character.toUpperCase(spaced.charAt(0)) + spaced.substring(1);
    }

    private static List<String> formatLines(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(Submission::formatListItem).collect(Collectors.toList());
        }
        if (value instanceof Map<?, ?> map) {
            return List.of(formatMapInline(map));
        }
        return List.of(String.valueOf(value));
    }

    private static String formatListItem(Object item) {
        if (item instanceof Map<?, ?> map) {
            Object category = map.get("category");
            Object problem = map.get("problem");
            if (category != null && problem != null && map.size() == 2) {
                return category + ": " + problem;
            }
            return formatMapInline(map);
        }
        return String.valueOf(item);
    }

    private static String formatMapInline(Map<?, ?> map) {
        return map.entrySet().stream()
                .map(e -> humanize(String.valueOf(e.getKey())) + ": " + e.getValue())
                .collect(Collectors.joining(", "));
    }

    public LeadStatus getStatus() {
        return status;
    }

    public void setStatus(LeadStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
