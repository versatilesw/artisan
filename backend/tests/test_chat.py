import pytest
from fastapi import status
from app.schemas import MessageCreate, MessageUpdate

def test_create_message(client):
    """Test creating a new message and receiving a bot response"""
    message_content = "Hello, I have a question about Artisan"
    response = client.post(
        "/api/messages",
        json={"content": message_content, "sender": "user"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["content"] == message_content
    assert data["sender"] == "user"
    assert "id" in data
    
    # Check if bot response was created
    messages = client.get("/api/messages").json()
    assert len(messages) == 2  # User message + bot response
    bot_message = [m for m in messages if m["sender"] == "bot"][0]
    assert bot_message["parent_message_id"] == data["id"]

def test_get_messages(client):
    """Test retrieving all messages"""
    # Create a test message first
    client.post(
        "/api/messages",
        json={"content": "Test message", "sender": "user"}
    )
    
    response = client.get("/api/messages")
    assert response.status_code == status.HTTP_200_OK
    messages = response.json()
    assert len(messages) == 2  # User message + bot response
    assert messages[0]["sender"] == "user"
    assert messages[1]["sender"] == "bot"

def test_update_message(client):
    """Test updating a message and receiving a new bot response"""
    # Create initial message
    create_response = client.post(
        "/api/messages",
        json={"content": "Initial message", "sender": "user"}
    )
    message_id = create_response.json()["id"]
    
    # Update the message
    updated_content = "Updated message"
    update_response = client.put(
        f"/api/messages/{message_id}",
        json={"content": updated_content}
    )
    assert update_response.status_code == status.HTTP_200_OK
    assert update_response.json()["content"] == updated_content
    
    # Check if new bot response was created
    messages = client.get("/api/messages").json()
    bot_messages = [m for m in messages if m["sender"] == "bot"]
    assert len(bot_messages) == 1
    assert bot_messages[0]["parent_message_id"] == message_id

def test_delete_message(client):
    """Test deleting a message and its associated bot response"""
    # Create a message to delete
    create_response = client.post(
        "/api/messages",
        json={"content": "Message to delete", "sender": "user"}
    )
    message_id = create_response.json()["id"]
    
    # Verify both messages exist
    messages_before = client.get("/api/messages").json()
    assert len(messages_before) == 2
    
    # Delete the message
    delete_response = client.delete(f"/api/messages/{message_id}")
    assert delete_response.status_code == status.HTTP_200_OK
    
    # Verify both messages are deleted
    messages_after = client.get("/api/messages").json()
    assert len(messages_after) == 0

def test_cannot_edit_bot_message(client):
    """Test that bot messages cannot be edited"""
    # Create a message to get a bot response
    create_response = client.post(
        "/api/messages",
        json={"content": "Test message", "sender": "user"}
    )
    
    # Get the bot's response message
    messages = client.get("/api/messages").json()
    bot_message = [m for m in messages if m["sender"] == "bot"][0]
    
    # Try to update bot's message
    update_response = client.put(
        f"/api/messages/{bot_message['id']}",
        json={"content": "Trying to edit bot message"}
    )
    assert update_response.status_code == status.HTTP_403_FORBIDDEN

def test_cannot_delete_bot_message(client):
    """Test that bot messages cannot be deleted directly"""
    # Create a message to get a bot response
    create_response = client.post(
        "/api/messages",
        json={"content": "Test message", "sender": "user"}
    )
    
    # Get the bot's response message
    messages = client.get("/api/messages").json()
    bot_message = [m for m in messages if m["sender"] == "bot"][0]
    
    # Try to delete bot's message
    delete_response = client.delete(f"/api/messages/{bot_message['id']}")
    assert delete_response.status_code == status.HTTP_403_FORBIDDEN

def test_message_persistence(client):
    """Test that messages persist in the database"""
    # Create multiple messages
    messages_to_create = [
        "First message",
        "Second message",
        "Third message"
    ]
    
    for content in messages_to_create:
        client.post(
            "/api/messages",
            json={"content": content, "sender": "user"}
        )
    
    # Verify all messages (including bot responses) are stored
    response = client.get("/api/messages")
    messages = response.json()
    assert len(messages) == len(messages_to_create) * 2  # User messages + bot responses
    user_messages = [m for m in messages if m["sender"] == "user"]
    assert len(user_messages) == len(messages_to_create)
    
    # Verify message contents are preserved
    user_contents = [m["content"] for m in user_messages]
    assert all(content in user_contents for content in messages_to_create)
