router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  const userId = req.params.id;

  // optional: prevent admin deleting themselves
  if (req.user.id == userId) {
    return res.status(400).json({ message: "You cannot delete yourself" });
  }

  try {
    const [result] = await db.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user" });
  }
});